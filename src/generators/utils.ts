import { installWithNpmClient, lodash, logger, prompts } from '@umijs/utils';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { IApi } from '../types';

export class GeneratorHelper {
  constructor(readonly api: IApi) {}

  addDevDeps(deps: Record<string, string>) {
    const { api } = this;
    if (!lodash.isEmpty(deps)) {
      api.pkg.devDependencies = {
        ...api.pkg.devDependencies,
        ...deps,
      };
      writeFileSync(api.pkgPath, JSON.stringify(api.pkg, null, 2));
      logger.info('Update package.json for devDependencies');
    }
  }

  addScript(name: string, cmd: string) {
    const { api } = this;

    this.addScriptToPkg(name, cmd);
    writeFileSync(api.pkgPath, JSON.stringify(api.pkg, null, 2));
    logger.info('Update package.json for scripts');
  }

  addScripts(scripts: { [script: string]: string }) {
    const { api } = this;

    for (const [name, cmd] of Object.entries(scripts)) {
      this.addScriptToPkg(name, cmd);
    }
    writeFileSync(api.pkgPath, JSON.stringify(api.pkg, null, 2));
    logger.info('Update package.json for scripts');
  }

  private addScriptToPkg(name: string, cmd: string) {
    const { api } = this;

    if (api.pkg.scripts?.[name] && api.pkg.scripts?.[name] !== cmd) {
      logger.warn(
        `scripts.${name} = "${api.pkg.scripts?.[name]}" already exists, will be overwritten with "${cmd}"!`,
      );
    }

    api.pkg.scripts = {
      ...api.pkg.scripts,
      [name]: cmd,
    };
  }

  appendGitIgnore(patterns: string[]) {
    const { api } = this;

    const gitIgnorePath = join(api.cwd, '.gitignore');

    if (existsSync(gitIgnorePath)) {
      const gitIgnore = readFileSync(gitIgnorePath, 'utf-8');
      const toAppendPatterns = patterns.filter(
        (pattern) => !gitIgnore.includes(pattern),
      );

      if (toAppendPatterns.length > 0) {
        const toAppend = patterns.join('\n');

        writeFileSync(gitIgnorePath, `${gitIgnore}\n${toAppend}`);
        logger.info('Update .gitignore');
      }
    }
  }

  installDeps() {
    const { npmClient } = this.api.appData;
    if (npmClient) {
      installWithNpmClient({
        npmClient,
      });
      logger.info(`使用 ${npmClient} 安装依赖`);
    } else {
      logger.warn(`请手动安装依赖`);
    }
  }

  async ensureVariableWithQuestion<V>(
    v: V,
    question: Omit<prompts.PromptObject<'variable'>, 'name'>,
  ) {
    if (!v) {
      const res = await promptsExitWhenCancel({
        ...question,
        name: 'variable',
      });

      return res.variable ? res.variable : question.initial;
    }

    return v;
  }
}

// the definition is copied from prompts.d.ts; if there is a better way to do this, tell me.
export function promptsExitWhenCancel<T extends string = string>(
  questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
  options?: Pick<prompts.Options, 'onSubmit'>,
): Promise<prompts.Answers<T>> {
  return prompts(questions, {
    ...options,
    onCancel: () => {
      process.exit(1);
    },
  });
}

export function trim(s?: string) {
  return s?.trim() || '';
}

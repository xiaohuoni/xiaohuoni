import {
  BaseGenerator,
  installWithNpmClient,
  logger,
  prompts,
} from '@umijs/utils';
import { IApi, Init, InitType } from '../types';

export default (api: IApi) => {
  api.registerCommand({
    name: 'init',
    alias: 'i',
    details: `
${process.env.FRAMEWORK_NAME || 'xiaohuoni'} init
`,
    description: 'init package quickly',
    configResolveMode: 'loose',
    async fn({ args }) {
      const [type] = args._;

      // 一个都没注册
      if (!api.appData.inits) {
        logger.warn('没有找到任何的初始化程序');
        return;
      }

      const runGenerator = async (options: Init) => {
        if (!options?.template) {
          throw new Error(`Init template: ${options.template} not found.`);
        }
        const generator = new BaseGenerator({
          path: options.template,
          target: api.paths.cwd,
          questions: options?.questions,
        });
        await generator.run();
        const { npmClient } = await prompts([
          {
            type: 'select',
            name: 'npmClient',
            message: 'Pick Npm Client',
            choices: [
              { title: 'npm', value: 'npm' },
              { title: 'cnpm', value: 'cnpm' },
              { title: 'tnpm', value: 'tnpm' },
              { title: 'yarn', value: 'yarn' },
              { title: 'pnpm', value: 'pnpm', selected: true },
            ],
          },
        ]);
        installWithNpmClient({ npmClient });
      };

      if (type) {
        const init = api.appData.inits[type];
        if (!init) {
          throw new Error(`Init ${type} not found.`);
        }
        if (init.type === InitType.enable) {
          const enable = await init.checkEnable?.({
            args,
          });
          if (!enable) {
            if (typeof init.disabledDescription === 'function') {
              logger.warn(init.disabledDescription());
            } else {
              logger.warn(init.disabledDescription);
            }
            return;
          }
        }
        await runGenerator(init);
      } else {
        const getEnableInits = async (inits: typeof api.appData.inits) => {
          const questions = [] as { title: string; value: string }[];
          for (const key of Object.keys(inits)) {
            const g = inits[key];
            if (g.type === InitType.init) {
              questions.push({
                title: `${g.name} -- ${g.description}` || '',
                value: g.key,
              });
            } else {
              const enable = await g?.checkEnable?.({
                args,
              });
              if (enable) {
                questions.push({
                  title: `${g.name} -- ${g.description}` || '',
                  value: g.key,
                });
              }
            }
          }
          return questions;
        };
        const questions = await getEnableInits(api.appData.inits);
        const { gType } = await prompts({
          type: 'select',
          name: 'gType',
          message: 'Pick init type',
          choices: questions,
        });
        await runGenerator(api.appData.inits[gType]);
      }
    },
  });

  api.registerMethod({
    name: 'registerInit',
    fn: (args: Init) => {
      // inits: Record<string, Init> = {};
      api.modifyAppData((memo) => {
        if (!memo.inits) memo.inits = {};
        memo.inits[args.key] = args;
        return memo;
      });
    },
  });
};

import { chalk, lodash, logger } from '@umijs/utils';
import { IApi } from '../types';

export default (api: IApi) => {
  api.registerCommand({
    name: 'help',
    description: 'show commands help',
    details: `
${process.env.FRAMEWORK_NAME || 'xiaohuoni'} help build
${process.env.FRAMEWORK_NAME || 'xiaohuoni'} help dev
`,
    configResolveMode: 'loose',
    fn() {
      const subCommand = api.args._[0];
      if (subCommand) {
        if (subCommand in api.service.commands) {
          showHelp(api.service.commands[subCommand]);
        } else {
          logger.error(`Invalid sub command ${subCommand}.`);
        }
      } else {
        showHelps(api.service.commands);
      }
    },
  });

  function showHelp(command: any) {
    console.log(`
Usage: xiaohuoni ${command.name} [options]
${command.description ? `${chalk.gray(command.description)}.\n` : ''}
${command.options ? `Options:\n${padLeft(command.options)}\n` : ''}
${command.details ? `Details:\n${padLeft(command.details)}` : ''}
`);
  }

  function showHelps(commands: typeof api.service.commands) {
    console.log(`
Usage: xiaohuoni <command> [options]

Commands:

${getDeps(commands)}
`);
    console.log(
      `Run \`${chalk.bold(
        'xiaohuoni help <command>',
      )}\` for more information of specific commands.`,
    );
    console.log(`Visit ${chalk.bold('https://xiaohuoni.com/')} to find me.`);
    console.log();
  }

  function getDeps(commands: any) {
    return Object.keys(commands)
      .map((key) => {
        return `    ${chalk.green(lodash.padEnd(key, 10))}${
          commands[key].description || ''
        }`;
      })
      .join('\n');
  }

  function padLeft(str: string) {
    return str
      .trim()
      .split('\n')
      .map((line: string) => `    ${line}`)
      .join('\n');
  }
};

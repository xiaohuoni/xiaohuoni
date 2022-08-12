import { logger, printHelp, yParser } from '@umijs/utils';
import {
  checkLocal,
  checkVersion as checkNodeVersion,
  setNoDeprecation,
  setNodeTitle,
} from './node';
import { Service } from './service/service';

export async function run() {
  checkNodeVersion();
  checkLocal();
  setNodeTitle();
  setNoDeprecation();

  const args = yParser(process.argv.slice(2), {
    alias: {
      version: ['v'],
      help: ['h'],
    },
    boolean: ['version'],
  });
  try {
    await new Service().run2({
      name: args._[0],
      args,
    });
  } catch (e: any) {
    logger.fatal(e);
    printHelp.exit();
    process.exit(1);
  }
}

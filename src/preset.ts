import { logger } from '@umijs/utils';
import { IApi } from './types';

export default (api: IApi) => {
  api.onStart(() => {
    logger.ready('welcome to xiaohuoni world!');
  });
  return {
    plugins: [
      // inits
      require.resolve('./inits/umiplugin'),

      // generators
      require.resolve('./generators/prettier'),
      require.resolve('./generators/tsconfig'),
    ].filter(Boolean),
  };
};

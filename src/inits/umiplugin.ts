import { prompts } from '@umijs/utils';
import { join } from 'path';
import { IApi, InitType } from '../types';

export default (api: IApi) => {
  api.describe({
    key: 'inits:umiplugin',
  });

  api.registerInit({
    key: 'umiplugin',
    name: 'Umi Plugin',
    description: '初始化 Umi 插件',
    template: join(__dirname, '..', '..', 'templates', 'plugin'),
    type: InitType.init,
    questions: [
      {
        name: 'name',
        type: 'text',
        message: `What's the plugin name?`,
      },
      {
        name: 'description',
        type: 'text',
        message: `What's your plugin used for?`,
      },
      {
        name: 'mail',
        type: 'text',
        message: `What's your email?`,
      },
      {
        name: 'author',
        type: 'text',
        message: `What's your name?`,
      },
      {
        name: 'org',
        type: 'text',
        message: `Which organization is your plugin stored under github?`,
      },
      {
        type: 'select',
        name: 'registry',
        message: 'Pick Bpm Registry',
        choices: [
          {
            title: 'npm',
            value: 'https://registry.npmjs.org/',
            selected: true,
          },
          { title: 'taobao', value: 'https://registry.npmmirror.com' },
        ],
      },
    ] as prompts.PromptObject[],
  });
};

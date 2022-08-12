import type { IServicePluginAPI, PluginAPI } from '@umijs/core';
import { prompts } from '@umijs/utils';

export enum InitType {
  init = 'init',
  enable = 'enable',
}

type IInitOptsWithoutEnableCheck = {
  key: string;
  name: string;
  description: string;
  type: InitType.init;
  questions?: prompts.PromptObject[];
  template: string;
};

type IInitOptsWithEnableCheck = {
  key: string;
  name: string;
  description: string;
  type: InitType.enable;
  checkEnable: {
    (opts: { args: any }): boolean;
  };
  disabledDescription: string | (() => string);
  questions?: prompts.PromptObject[];
  template: string;
};

export type Init = IInitOptsWithEnableCheck | IInitOptsWithoutEnableCheck;

export function makeInit<T>(opts: T): T {
  return {
    ...opts,
  };
}

export type IApi = PluginAPI &
  IServicePluginAPI & {
    registerInit(opts: Init): void;
  };

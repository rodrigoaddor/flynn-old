import { Module } from '../data/module';

export type PromiseOr<T> = Promise<T> | T;

export const initModule = (_module: any): Module => {
  try {
    return new _module();
  } catch {
    return _module;
  }
};

export const getAllIntents = (modules: Module[]) => {
  const intents = modules.map((module) => module.intents ?? []).flat();
  return [...new Set(intents)];
};
 
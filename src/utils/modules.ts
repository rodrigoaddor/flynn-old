import { Module } from '../data/module';

export type PromiseOr<T> = Promise<T> | T;

export const initModule = (module: any): Module => {
  try {
    return new module();
  } catch {
    return module;
  }
};

export const getAllIntents = (modules: Module[]) => {
  const intents = modules.map((module) => module.intents ?? []).flat();
  return [...new Set(intents)];
};

import 'reflect-metadata';
import Discord, { Intents } from 'discord.js';

import * as classModules from './modules';
import { Module } from './data/module';

const modules: Module[] = Object.values(classModules).map((module) => new module());

console.log(`Loaded ${Object.entries(modules).length} modules.`);

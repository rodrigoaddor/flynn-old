import 'reflect-metadata';
import { Client } from 'discord.js';
import { container } from 'tsyringe';

import { validateOptions, initialize } from './data/db';
import { Module } from './data/module';
import { getAllIntents, initModule } from './utils/modules';

import * as _modules from './modules';
import { Bot, Database } from './utils/symbols';

const { stdin } = process;

const modules: Module[] = Object.values(_modules).map(initModule);

// Validate Database configuration
const valid = validateOptions();
if (valid !== true) {
  console.error(`Missing fields: ${valid.join(', ')}`);
  process.exit(1);
}

// Initialize bot and database
const bot = new Client({ intents: getAllIntents(modules) });
container.register(Bot, { useValue: bot });

const db = initialize();
container.register(Database, { useValue: db });

bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user?.tag ?? '[unknown]'}`);

  for (const module of modules) {
    console.log(`Loading ${module.name}`);
    await module.onLoad?.();
  }

  console.log('Synchronizing database');
  await db.authenticate();
  await db.sync();

  for (const module of modules) {
    console.log(`Enabling ${module.name}`);
    await module.onEnable?.();
  }
});

console.log('Press [q] to exit');
stdin.setRawMode(true);
stdin.setEncoding('utf-8');
stdin.on('data', async (key: string) => {
  if (key === 'q') {
    for (const module of modules) {
      console.log(`Disabling ${module.name}`);
      await module.onDisable?.();
    }

    for (const module of modules) {
      console.log(`Unloading ${module.name}`);
      await module.onUnload?.();
    }

    bot.destroy();
    process.exit(0);
  }
});

bot.login(process.env.TOKEN);

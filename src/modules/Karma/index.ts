import { Client, IntentsString, MessageReaction } from 'discord.js';
import { container } from 'tsyringe';

import { Module } from '../../data/module';
import { Bot } from '../../utils/symbols';
import { KarmaData } from './MemberKarma';

type KarmaEmojis = 'upvote' | 'downvote';

export class Karma implements Module {
  readonly name = 'Karma';

  readonly intents: IntentsString[] = ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'];

  static readonly emojis: Readonly<Record<KarmaEmojis, number>> = Object.freeze({
    upvote: 1,
    downvote: -1,
  });

  private bot!: Client;

  onLoad = () => {
    this.bot = container.resolve<Client>(Bot);

    KarmaData.start();
  };

  onEnable = () => {
    this.bot.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.partial) return;

      if (!Karma.isReaction(reaction)) return;

      const [data] = await KarmaData.findOrCreate({
        where: { member: user.id },
        defaults: { member: user.id },
      });
      await data.increment('karma', {
        by: Karma.getReactionKarma(reaction),
      });
    });

    this.bot.on('messageReactionRemove', async (reaction, user) => {
      if (reaction.partial || !Karma.isReaction(reaction)) return;

      await KarmaData.increment('karma', {
        where: { member: user.id },
        by: Karma.getReactionKarma(reaction),
      });
    });

    this.bot.on('messageReactionRemoveEmoji', async (reaction) => {
      if (reaction.partial || !Karma.isReaction(reaction)) return;
      const users = await reaction.users.fetch();

      await KarmaData.increment('karma', {
        where: { member: users },
        by: Karma.getReactionKarma(reaction) * -1,
      });
    });

    this.bot.on('messageReactionRemoveAll', async (message) => {
      const reactions = message.reactions.cache.filter(Karma.isReaction).values();
      for (const reaction of reactions) {
        KarmaData.increment('karma', {
          where: { member: reaction.users.cache.map((user) => user.id) },
          by: Karma.getReactionKarma(reaction) * -1,
        });
      }
    });

    this.bot.on('messageDelete', async (message) => {
      const reactions = message.reactions.cache.filter(Karma.isReaction).values();
      for (const reaction of reactions) {
        KarmaData.increment('karma', {
          where: { member: reaction.users.cache.map((user) => user.id) },
          by: Karma.getReactionKarma(reaction) * -1,
        });
      }
    });
  };

  private static isReaction(reaction: MessageReaction): boolean {
    return Object.keys(Karma.emojis).includes(reaction.emoji.name!);
  }

  private static getReactionKarma(reaction: MessageReaction): number {
    if (!this.isReaction(reaction)) return 0;

    return Karma.emojis[reaction.emoji.name as KarmaEmojis];
  }
}

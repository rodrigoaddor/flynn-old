import { IntentsString } from 'discord.js';

import { PromiseOr } from '../utils/modules';

export interface Module {
  name: string;
  description?: string;
  intents?: IntentsString[];

  onLoad?: () => PromiseOr<void>;
  onUnload?: () => PromiseOr<void>;
  onEnable?: () => PromiseOr<void>;
  onDisable?: () => PromiseOr<void>;
}

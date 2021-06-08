import { Intents } from 'discord.js';

export interface Module {
  name: string;
  description?: string;
  intents?: Intents[];

  onLoad?: () => void
  onUnload?: () => void
  onEnable?: () => void
  onDisable?: () => void
}

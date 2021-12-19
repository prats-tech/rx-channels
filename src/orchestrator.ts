import { Observable } from 'rxjs';

import { Channel } from './channel';
import {
  ChannelInterface,
  ChannelOrchestratorInterface,
  CreateChannelInterface,
} from './types';

export class ChannelOrchestrator implements ChannelOrchestratorInterface {
  private static instance: ChannelOrchestrator;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ChannelOrchestrator();
    }
    return this.instance;
  }

  public static destroyInstance() {
    this.instance = null;
  }

  private channels: Map<string, ChannelInterface>;

  private constructor() {
    this.channels = new Map<string, ChannelInterface>();
  }

  addChannel(contract: CreateChannelInterface): this {
    if (!contract.channel && !contract.config) {
      throw new Error(
        'You cannot add a channel without informing a config or a instance of channel.',
      );
    } else if (contract.channel && contract.config) {
      throw new Error(
        'You cannot add a channel, informing an instance and a config.',
      );
    }

    const channel: ChannelInterface = contract.config
      ? new Channel(contract.config)
      : contract.channel;

    if (!this.channels.has(channel.getName())) {
      this.channels.set(channel.getName(), channel);
    }

    return this;
  }

  destroyChannel(channel: string): boolean {
    if (!this.channels.has(channel)) {
      throw new Error('Channel not found.');
    }
    return this.channels.delete(channel);
  }

  destroyChannels(): boolean {
    this.channels.clear();
    return true;
  }

  dispatch<T = any>(channel: string, message: T): ChannelOrchestrator {
    if (!this.channels.has(channel)) {
      throw new Error('Channel not found.');
    }
    this.channels.get(channel).dispatch<T>(message);
    return this;
  }

  getChannelObservable<T = any>(channel: string): Observable<T> {
    if (!this.channels.has(channel)) {
      throw new Error('Channel not found.');
    }
    return this.channels.get(channel).getObservable<T>();
  }
}

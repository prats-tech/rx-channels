import { Observable } from 'rxjs';

import { Channel } from './channel';
import {
  ChannelConfig,
  ChannelInterface,
  ChannelOrchestratorInterface,
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

  private channelFactory(config: ChannelConfig): Channel {
    return new Channel(config);
  }

  addChannel<T = any>(
    configOrChannel: ChannelConfig | ChannelInterface,
  ): Observable<T> {
    const channel: ChannelInterface =
      configOrChannel instanceof ChannelConfig
        ? this.channelFactory(configOrChannel)
        : configOrChannel;
    this.channels.set(channel.getName(), channel);
    return this.getObservable(channel.getName());
  }

  dispatch<T = any>(channel: string, message: T): ChannelOrchestrator {
    if (!this.channels.has(channel)) {
      throw new Error('Channel not found.');
    }
    this.channels.get(channel).dispatch<T>(message);
    return this;
  }

  getObservable<T = any>(channel: string): Observable<T> {
    if (!this.channels.has(channel)) {
      throw new Error('Channel not found.');
    }
    return this.channels.get(channel).getObservable<T>();
  }
}

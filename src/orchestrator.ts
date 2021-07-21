import { Observable } from 'rxjs';

import { Channel, ChannelConfig, ChannelInterface } from './channel';

export interface ChannelOrchestratorInterface {
  createChannel<T = any>(
    configOrName: ChannelConfig,
    channel?: ChannelInterface,
  ): Observable<T>;
  dispatch<T = any>(key: string, message: T): ChannelOrchestratorInterface;
  getObservable<T = any>(key: string): Observable<T>;
}

export class ChannelOrchestrator implements ChannelOrchestratorInterface {
  // singleton/static
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

  // instance
  private constructor() {
    this.channels = new Map<string, ChannelInterface>();
  }

  createChannel<T = any>(
    configOrChannel: ChannelConfig | ChannelInterface,
  ): Observable<T> {
    const channel: ChannelInterface =
      configOrChannel instanceof ChannelConfig
        ? new Channel(configOrChannel as ChannelConfig)
        : configOrChannel;
    this.channels.set(channel.getName(), channel);
    return this.getObservable(channel.getName());
  }

  dispatch<T = any>(key: string, message: T): ChannelOrchestrator {
    if (!this.channels.has(key)) {
      throw new Error('Channel not found.');
    }
    this.channels.get(key).dispatch<T>(message);
    return this;
  }

  getObservable<T = any>(key: string): Observable<T> {
    if (!this.channels.has(key)) {
      throw new Error('Channel not found.');
    }
    return this.channels.get(key).getObservable<T>();
  }
}

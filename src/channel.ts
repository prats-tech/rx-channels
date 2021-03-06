import { Observable } from 'rxjs';

import { SyncProvider } from './sync-provider';

import {
  ChannelConfig,
  ChannelDispatcherInterface,
  ChannelInterface,
  ChannelSubscriberInterface,
  ChannelType,
} from './types';

export class Channel implements ChannelInterface {
  private type: ChannelType;
  private name: string;
  private subscriber?: ChannelSubscriberInterface | null;
  private dispatcher?: ChannelDispatcherInterface | null;

  constructor(config: ChannelConfig) {
    this.type = config.type ?? ChannelType.Sync;
    this.name = config.name;

    if (this.type === ChannelType.Sync) {
      const syncProvider = new SyncProvider();
      this.subscriber = syncProvider;
      this.dispatcher = syncProvider;
    } else {
      if (!config.dispatcher && !config.subscriber) {
        throw new Error('Async channel requires a dispatcher or subscriber.');
      }
      this.dispatcher = config.dispatcher ?? null;
      this.subscriber = config.subscriber ?? null;
    }
  }

  dispatch<T = any>(message: T): void {
    if (!this.dispatcher) {
      throw new Error(`Channel ${this.getName()} has no dispatcher.`);
    }
    this.dispatcher.dispatch<T>(message);
  }

  getObservable<T = any>(): Observable<T> {
    if (!this.subscriber) {
      throw new Error(`Channel ${this.getName()} has no subscriber.`);
    }
    return this.subscriber.getObservable<T>();
  }

  getName(): string {
    return this.name;
  }

  getType(): ChannelType {
    return this.type;
  }
}

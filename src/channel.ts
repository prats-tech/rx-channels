import { Observable, Subject } from 'rxjs';

import {
  ChannelConfig,
  ChannelDispatcherInterface,
  ChannelInterface,
  ChannelSubscriberInterface,
  ChannelType,
} from './types';

export class Channel implements ChannelInterface {
  private type: ChannelType | string;
  private name: string;
  private subject?: Subject<any>;

  private subscriber?: ChannelSubscriberInterface | null;
  private dispatcher?: ChannelDispatcherInterface | null;

  constructor(config: ChannelConfig) {
    this.type = config.type;
    this.name = config.name;

    if (this.type === ChannelType.Sync) {
      this.subject = new Subject();
    } else {
      if (!config.dispatcher && !config.subscriber) {
        throw new Error('Async channel requires a dispatcher or subscriber.');
      }
      this.dispatcher = config.dispatcher ?? null;
      this.subscriber = config.subscriber ?? null;
    }
  }

  dispatch<T = any>(message: T): ChannelInterface {
    if (this.type === ChannelType.Async) {
      if (this.dispatcher) {
        this.dispatcher.dispatch(message);
      } else {
        throw new Error(`Channel ${this.getName()} has no dispatcher.`);
      }
    } else {
      this.subject.next(message);
    }
    return this;
  }

  getObservable<T = any>(): Observable<T> {
    if (this.type === ChannelType.Async) {
      if (this.subscriber) {
        return this.subscriber.getObservable();
      } else {
        throw new Error(`Channel ${this.getName()} has no subscriber.`);
      }
    } else {
      return this.subject.asObservable();
    }
  }

  getName() {
    return this.name;
  }

  getType(): string {
    return this.type;
  }
}

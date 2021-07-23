import { Observable } from 'rxjs';

export interface ChannelDispatcherInterface {
  dispatch<T = any>(message: T): void;
}

export interface ChannelSubscriberInterface {
  getObservable<T = any>(): Observable<T>;
}

export enum ChannelType {
  Sync = 'sync',
  Async = 'async',
}

export interface ChannelInterface {
  dispatch<T = any>(message: T): ChannelInterface;
  getObservable<T = any>(): Observable<T>;
  getName(): string;
  getType(): ChannelType | string;
}

export class ChannelConfig {
  type: ChannelType | string;
  name: string;
  dispatcher?: ChannelDispatcherInterface;
  subscriber?: ChannelSubscriberInterface;
}

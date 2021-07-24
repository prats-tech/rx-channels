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
  dispatch<T = any>(message: T): void;
  getObservable<T = any>(): Observable<T>;
  getName(): string;
  getType(): ChannelType;
}

export class ChannelConfig {
  name: string;
  // by default will be sync
  type?: ChannelType;
  dispatcher?: ChannelDispatcherInterface;
  subscriber?: ChannelSubscriberInterface;
}

export interface ChannelOrchestratorInterface {
  addChannel(contract: CreateChannelInterface): ChannelOrchestratorInterface;
  destroyChannel(channel: string): boolean;
  destroyChannels(): boolean;
  dispatch<T = any>(channel: string, message: T): ChannelOrchestratorInterface;
  getChannelObservable<T = any>(channel: string): Observable<T>;
}

export interface CreateChannelInterface {
  config?: ChannelConfig;
  channel?: ChannelInterface;
}

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
  getType(): ChannelType | string;
}

export class ChannelConfig {
  type: ChannelType | string;
  name: string;
  dispatcher?: ChannelDispatcherInterface;
  subscriber?: ChannelSubscriberInterface;
}

export interface ChannelOrchestratorInterface {
  addChannel<T = any>(
    configOrChannel: ChannelConfig | ChannelInterface,
  ): Observable<T>;
  dispatch<T = any>(channel: string, message: T): ChannelOrchestratorInterface;
  getObservable<T = any>(channel: string): Observable<T>;
}

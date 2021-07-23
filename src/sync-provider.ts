import { Observable, Subject } from 'rxjs';

import {
  ChannelDispatcherInterface,
  ChannelSubscriberInterface,
} from './types';

export class SyncProvider
  implements ChannelSubscriberInterface, ChannelDispatcherInterface
{
  private subject: Subject<any>;

  constructor() {
    this.subject = new Subject();
  }

  dispatch<T = any>(message: T): void {
    this.subject.next(message);
  }

  getObservable<T = any>(): Observable<T> {
    return this.subject.asObservable();
  }
}

import { Observable, Subject } from 'rxjs';

export interface ChannelInterface {
  dispatch<T = any>(message: T): ChannelInterface;
  getObservable<T = any>(): Observable<T>;
  getName(): string;
}

export class ChannelConfig {
  type: 'sync' | 'async';
  name: string;
}

export class Channel implements ChannelInterface {
  private subject: Subject<any>;

  constructor(private config: ChannelConfig) {
    this.subject = new Subject();
  }

  dispatch<T = any>(message: T): ChannelInterface {
    this.subject.next(message);
    return this;
  }

  getObservable<T = any>(): Observable<T> {
    return this.subject.asObservable();
  }

  getName() {
    return this.config.name;
  }
}

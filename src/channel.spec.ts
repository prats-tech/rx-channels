import { Observable } from 'rxjs';

import { Channel } from './channel';
import { ChannelType } from './types';

describe('Channel use-cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the exact same name', () => {
    const channelName = 'channel-test';
    const channel = new Channel({
      name: channelName,
    });
    expect(channel.getName()).toBe(channelName);
  });

  it('should return the exact same type', () => {
    const channelType = ChannelType.Sync;
    const channel = new Channel({
      name: 'channel-test',
      type: channelType,
    });
    expect(channel.getType()).toBe(channelType);
  });

  it('should dispatch a message', () => {
    const myMessage = 'my-message';
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Sync,
    });
    channel.getObservable().subscribe({
      next: message => {
        expect(message).toBe(myMessage);
      },
    });
    channel.dispatch(myMessage);
  });

  it('should getObservable be instanceof observable', () => {
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Sync,
    });
    expect(channel.getObservable()).toBeInstanceOf(Observable);
  });

  it('should return an error if no subscriber or dispatcher was informed', () => {
    try {
      new Channel({
        name: 'channel-test',
        type: ChannelType.Async,
      });
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should not return an error if informing a subscriber and not informing a dispatcher', () => {
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Async,
      subscriber: {
        getObservable: () => new Observable(),
      },
    });
    expect(channel.getObservable()).toBeInstanceOf(Observable);
  });

  it('should not return an error if informing a dispatcher and not informing a subscriber', () => {
    const myMessage = 'message';
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Async,
      dispatcher: {
        dispatch: message => {
          expect(message).toBe(myMessage);
        },
      },
    });
    channel.dispatch(myMessage);
  });

  it('should return an error when trying to dispatch a message without implementing a dispatcher', () => {
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Async,
      subscriber: {
        getObservable: () => new Observable(),
      },
    });
    try {
      channel.dispatch('something');
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should return an error when trying to subscribe to an observable without implementing a subscriber', () => {
    const channel = new Channel({
      name: 'channel-test',
      type: ChannelType.Async,
      dispatcher: {
        dispatch: message => {},
      },
    });
    try {
      channel.getObservable().subscribe({
        next: message => {},
      });
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('Should return type sync if you dont inform the type of a channel', () => {
    const channel = new Channel({
      name: 'channel-test',
    });
    expect(channel.getType()).toBe(ChannelType.Sync);
  });
});

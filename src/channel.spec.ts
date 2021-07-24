import { Observable } from 'rxjs';
import { Channel } from './channel';

describe('Channel use cases scenarios', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the exact same name', () => {
    const channelName = 'channel-test';
    const channel = new Channel({
      name: channelName,
      type: 'sync',
    });
    expect(channel.getName()).toBe(channelName);
  });

  it('should return the exact same type', () => {
    const channelType = 'sync';
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
      type: 'sync',
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
      type: 'sync',
    });
    expect(channel.getObservable()).toBeInstanceOf(Observable);
  });

  it('should return an error if no subscriber or dispatcher was informed', () => {
    try {
      new Channel({
        name: 'channel-test',
        type: 'async',
      });
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err?.message).toBe(
        'Async channel requires a dispatcher or subscriber.',
      );
    }
  });

  it('should not return an error if informing a subscriber and not informing a dispatcher', () => {
    const channel = new Channel({
      name: 'channel-test',
      type: 'async',
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
      type: 'async',
      dispatcher: {
        dispatch: message => {
          expect(message).toBe(myMessage);
        },
      },
    });
    channel.dispatch(myMessage);
  });
});

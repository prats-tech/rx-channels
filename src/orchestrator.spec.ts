import { Observable } from 'rxjs';

import { Channel } from './channel';
import { ChannelOrchestrator } from './orchestrator';
import { ChannelType } from './types';

describe('Orchestrator use-cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    ChannelOrchestrator.getInstance().destroyChannels();
  });

  it('should not create a channel informing anything', () => {
    try {
      ChannelOrchestrator.getInstance().addChannel({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should not create a channel informing a config and an instance', () => {
    try {
      ChannelOrchestrator.getInstance().addChannel({
        channel: new Channel({
          name: 'channel-test',
          type: ChannelType.Sync,
        }),
        config: {
          name: 'channel-test',
          type: ChannelType.Sync,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should not create the same channel in sequence', () => {
    try {
      ChannelOrchestrator.getInstance()
        .addChannel({
          config: {
            name: 'channel-test',
            type: ChannelType.Sync,
          },
        })
        .addChannel({
          config: {
            name: 'channel-test',
            type: ChannelType.Sync,
          },
        });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should create a new channel informing a config', () => {
    ChannelOrchestrator.getInstance().addChannel({
      config: {
        name: 'channel-test',
      },
    });

    expect(
      ChannelOrchestrator.getInstance().getChannelObservable('channel-test'),
    ).toBeInstanceOf(Observable);
  });

  it('should create a new channel informing a instance', () => {
    ChannelOrchestrator.getInstance().addChannel({
      channel: new Channel({
        name: 'channel-test',
        type: ChannelType.Sync,
      }),
    });
    expect(
      ChannelOrchestrator.getInstance().getChannelObservable('channel-test'),
    ).toBeInstanceOf(Observable);
  });

  it('should get an observable of already created channel', () => {
    ChannelOrchestrator.getInstance().addChannel({
      config: {
        name: 'channel-test',
        type: ChannelType.Sync,
      },
    });
    const channelObservable =
      ChannelOrchestrator.getInstance().getChannelObservable('channel-test');
    expect(channelObservable).toBeInstanceOf(Observable);
  });

  it('should throw an error when getting an observable of non-existing channel', () => {
    try {
      ChannelOrchestrator.getInstance().getChannelObservable('channel-test');
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should dispatch a message', () => {
    const myMessage = 'message';

    ChannelOrchestrator.getInstance().addChannel({
      config: {
        name: 'channel-test',
      },
    });

    ChannelOrchestrator.getInstance()
      .getChannelObservable('channel-test')
      .subscribe({
        next: (message: string) => {
          expect(message).toBe(myMessage);
        },
      });

    ChannelOrchestrator.getInstance().dispatch('channel-test', myMessage);
  });

  it('should throw an error when dispatching a message of non-existing channel', () => {
    try {
      ChannelOrchestrator.getInstance().dispatch('channel-test', 'message');
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should destroy the orchestrator', () => {
    const orchestrator = ChannelOrchestrator.getInstance();
    ChannelOrchestrator.destroyInstance();
    try {
      orchestrator.dispatch('channel-test', 'message');
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('should destroy a channel after create it', () => {
    const result = ChannelOrchestrator.getInstance()
      .addChannel({
        config: {
          name: 'channel-test',
        },
      })
      .destroyChannel('channel-test');
    expect(result).toBe(true);
  });

  it('should not be possible to destroy a channel that does not exist', () => {
    try {
      ChannelOrchestrator.getInstance().destroyChannel('channel-test');
      // just to prevent mistakes of implementation
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});

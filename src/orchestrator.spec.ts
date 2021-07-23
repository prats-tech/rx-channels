import { Observable } from 'rxjs';

import { ChannelOrchestrator } from './orchestrator';
import { ChannelInterface } from './types';

describe('Should test the ChannelOrchestrator', () => {
  type ChannelTest = {};

  const channel: jest.Mocked<ChannelInterface> = {
    dispatch: jest.fn(),
    getObservable: jest.fn(),
    getName: jest.fn(),
    getType: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    ChannelOrchestrator.destroyInstance();
  });

  beforeEach(() => {
    channel.getName.mockImplementation(() => 'channel-test');
    channel.getObservable.mockImplementation(() => new Observable());
  });

  it('should create a new channel', () => {
    const channelObservable =
      ChannelOrchestrator.getInstance().addChannel<ChannelTest>(channel);
    expect(channelObservable).toBeInstanceOf(Observable);
  });

  it('should get an observable of already created channel', () => {
    ChannelOrchestrator.getInstance().addChannel<ChannelTest>(channel);
    const channelObservable =
      ChannelOrchestrator.getInstance().getObservable<ChannelTest>(
        'channel-test',
      );
    expect(channelObservable).toBeInstanceOf(Observable);
  });

  it('should throw an error when getting an observable of non-existing channel', () => {
    try {
      ChannelOrchestrator.getInstance().getObservable<ChannelTest>(
        'channel-test',
      );
      // error was not throw, why?
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should dispatch a message', () => {
    const myMessage = 'message';
    channel.dispatch.mockImplementation(message => {
      expect(message).toBe(myMessage);
      return {} as ChannelInterface;
    });
    ChannelOrchestrator.getInstance().addChannel<ChannelTest>(channel);
    ChannelOrchestrator.getInstance().dispatch('channel-test', myMessage);
    expect(channel.dispatch).toBeCalled();
  });

  it('should throw an error when dispatching a message of non-existing channel', () => {
    try {
      ChannelOrchestrator.getInstance().dispatch('channel-test', 'message');
      // error was not throw, why?
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

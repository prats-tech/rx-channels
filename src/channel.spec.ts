import { Channel } from './channel';

describe('Should test the Channel', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should dispatch a message', () => {
    const channel = new Channel();
    channel.dispatch('message');
    expect(channel.dispatch).toBeInstanceOf(Function);
  });
});

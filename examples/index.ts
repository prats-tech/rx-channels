import { ChannelOrchestrator } from '../src';

const orchestrator = ChannelOrchestrator.getInstance();

orchestrator.addChannel({
  config: {
    name: 'channel-test-1',
  },
});

orchestrator.getChannelObservable('channel-test-1').subscribe({
  next: message => {
    console.log(message);
  },
});

orchestrator
  .dispatch('channel-test-1', 'hello world - channel 1')
  .dispatch('channel-test-1', { attr: 'value', attr2: false })
  .dispatch('channel-test-1', [{}, {}]);

import { Observable } from 'rxjs';
import { SyncProvider } from './sync-provider';

describe('Sync-provider use cases scenarios', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should getObservable return a observable', () => {
    const syncProvider = new SyncProvider();
    expect(syncProvider.getObservable()).toBeInstanceOf(Observable);
  });

  it('should dispatch return the same message dispatched', () => {
    const myMessage = 'message';
    const syncProvider = new SyncProvider();
    syncProvider.dispatch(myMessage);
    syncProvider.getObservable().subscribe({
      next: message => {
        expect(message).toBe(myMessage);
      },
    });
  });
});

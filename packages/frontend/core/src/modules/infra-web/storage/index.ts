import type { GlobalCache, GlobalState, Memento } from '@toeverything/infra';
import { Observable } from 'rxjs';

export class LocalStorageMemento implements Memento {
  constructor(private readonly prefix: string) {}

  get<T>(key: string): T | null {
    const json = localStorage.getItem(this.prefix + key);
    return json ? JSON.parse(json) : null;
  }
  watch<T>(key: string): Observable<T | null> {
    return new Observable<T | null>(subscriber => {
      const json = localStorage.getItem(this.prefix + key);
      const first = json ? JSON.parse(json) : null;
      subscriber.next(first);

      const channel = new BroadcastChannel(this.prefix + key);
      channel.addEventListener('message', event => {
        subscriber.next(event.data);
      });
      return () => {
        channel.close();
      };
    });
  }
  set<T>(key: string, value: T | null): void {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
    const channel = new BroadcastChannel(this.prefix + key);
    channel.postMessage(value);
    channel.close();
  }
}

export class LocalStorageGlobalCache
  extends LocalStorageMemento
  implements GlobalCache
{
  constructor() {
    super('global-cache:');
  }
}

export class LocalStorageGlobalState
  extends LocalStorageMemento
  implements GlobalState
{
  constructor() {
    super('global-state:');
  }
}

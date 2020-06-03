import { createChannel as createBaseChannel } from './channel';
import {
  PlatformMessage,
  PlatformChannel,
  PlatformChannelStrategy,
  ChannelListener,
  WorkerMessageEvent,
} from './types';


function createSharedWorkerStrategy(): PlatformChannelStrategy {
  const worker = new SharedWorker('./shared-worker.ts');

  function send(message: PlatformMessage) {
    worker.port.postMessage(message);
  }

  function listen(listener: ChannelListener) {
    const workerListener = (event: WorkerMessageEvent) => {
      listener(event.data);
    };

    worker.port.addEventListener('message', workerListener);

    return () => worker.port.removeEventListener('message', workerListener);
  }

  function ready() {
    worker.port.start();
    return Promise.resolve();
  }

  return {
    send,
    listen,
    ready,
  };
}

export function createChannel(name?: string): PlatformChannel {
  const strategy = createSharedWorkerStrategy();
  return createBaseChannel(strategy, name);
}

import { createChannel as createBaseChannel } from './channel';
import {
  PlatformMessage,
  PlatformChannel,
  PlatformChannelStrategy,
  ChannelListener,
  WorkerExtendableEvent,
  WorkerMessageEvent,
} from './types';

function createServiceWorkerStrategy(): PlatformChannelStrategy {
  const isSupported = 'serviceWorker' in navigator;

  function notifyAboutSupport() {
    if (!isSupported) {
      console.log(
        'ServiceWorker не поддерживается данным браузером. Использование PlatformChannel не будет иметь эффекта.'
      );
    }
  }

  function send(message: PlatformMessage) {
    if (navigator.serviceWorker.controller === null) {
      notifyAboutSupport();
      return;
    }

    navigator.serviceWorker.controller.postMessage(message);
  }

  function listen(listener: ChannelListener) {
    const swListener = (event: WorkerMessageEvent) => {
      listener(event.data);
    };

    navigator.serviceWorker.addEventListener('message', swListener);

    return () =>
      navigator.serviceWorker.removeEventListener('message', swListener);
  }

  function ready() {
    return navigator.serviceWorker.getRegistration();
  }

  return {
    send,
    listen,
    ready,
  };
}

export function setupChannelInServiceWorker(sw: ServiceWorkerGlobalScope) {
  sw.addEventListener('message', (e: WorkerExtendableEvent) => {
    e.waitUntil(
      sw.clients.matchAll().then(clients => {
        if (!clients || clients.length === 0) {
          return;
        }
        clients.forEach(client => {
          client.postMessage(e.data);
        });
      })
    );
  });
}

export function createChannel(name?: string): PlatformChannel {
  const strategy = createServiceWorkerStrategy();
  return createBaseChannel(strategy, name);
}

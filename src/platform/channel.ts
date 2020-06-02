export interface PlatformInputMessage {
  name: string;
  meta?: {
    [key: string]: any;
  };
  body: any;
}

export interface PlatformMessage {
  input: PlatformInputMessage;
  from: {
    uid: string;
    name?: string;
  };
}

interface SWMessageEvent extends MessageEvent {
  data: {
    message: PlatformMessage;
    meta: {
      self?: boolean;
    };
  };
}

export type UnsubFromChannel = () => void;
export type ChannelListener = (message: PlatformMessage) => void;
export type ClientUID = string;

interface SendOptions {
 self?: boolean;
}

export interface PlatformChannel {
  send(message: PlatformInputMessage, options?: SendOptions): void;
  listen(listener: ChannelListener): UnsubFromChannel;
  getUid(): string;
}

function createUID(): ClientUID {
  return Math.random()
    .toString(16)
    .substr(2, 8);
}

export function createChannel(name?: string): PlatformChannel {
  const uid = createUID();
  const listeners: ChannelListener[] = [];

  const serviceWorkerSupported = 'serviceWorker' in navigator;

  let isRegistred = false;
  let queue: { input: PlatformInputMessage, options: SendOptions }[] = [];

  function send(input: PlatformInputMessage, options: SendOptions = {}) {
    if (!serviceWorkerSupported) {
      return;
    }

    if (!isRegistred || navigator.serviceWorker.controller === null) {
      queue.push({ input, options });
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      meta: {
        self: options.self ?? false,
      },
      message: {
        input,
        from: {
          uid,
          name,
        },
      },
    });
  }

  function listen(listener: ChannelListener): UnsubFromChannel {
    if (!serviceWorkerSupported) {
      return () => {};
    }

    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      listeners.splice(idx, 1);
    };
  }

  const channel = {
    send,
    listen,
    getUid() {
      return uid;
    },
  };

  if (!serviceWorkerSupported) {
    console.log(
      'ServiceWorker не поддерживается данным браузером. Использование PlatformChannel не будет иметь эффекта.'
    );

    return channel;
  }

  navigator.serviceWorker.getRegistration().then(() => {
    isRegistred = true;
    queue.forEach(m => send(m.input, m.options));
    queue = [];
  });

  navigator.serviceWorker.addEventListener(
    'message',
    (event: SWMessageEvent) => {
      if (event.data.message.from.uid === uid && !event.data.meta.self) {
        return;
      }

      listeners.forEach(listener => {
        listener(event.data.message);
      });
    }
  );

  return channel;
}

interface SWPlatformMessageEvent extends ExtendableEvent {
  data: PlatformMessage;
}

export function setupChannelInServiceWorker(sw: ServiceWorkerGlobalScope) {
  sw.addEventListener('message', (e: SWPlatformMessageEvent) => {
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

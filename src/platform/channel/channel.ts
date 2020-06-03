import {
  PlatformMessage,
  PlatformInputMessage,
  PlatformChannel,
  PlatformChannelStrategy,
  ClientUID,
  SendOptions,
  ChannelListener,
  UnsubFromChannel,
} from './types';

function createUID(): ClientUID {
  return Math.random()
    .toString(16)
    .substr(2, 8);
}

interface QueueMessage {
  input: PlatformInputMessage;
  options: SendOptions;
}

export function createChannel(
  strategy: PlatformChannelStrategy,
  name?: string
): PlatformChannel {
  const uid = createUID();
  const listeners: ChannelListener[] = [];

  let isReady = false;
  let queue: QueueMessage[] = [];

  function notifyListeners(
    message: PlatformMessage,
    options: SendOptions = { self: false }
  ) {
    listeners.forEach(listener => {
      if (message.from.uid === uid && !options.self) {
        return;
      }

      listener(message);
    });
  }

  function send(input: PlatformInputMessage, options: SendOptions = {}) {
    const message: PlatformMessage = {
      input,
      from: {
        uid,
        name,
      },
    };

    notifyListeners(message, options);

    if (!isReady) {
      queue.push({ input, options });
      return;
    }

    strategy.send(message);
  }

  function listen(listener: ChannelListener): UnsubFromChannel {
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

  strategy.listen(notifyListeners);

  strategy.ready().then(() => {
    isReady = true;
    queue.forEach(m => send(m.input, m.options));
    queue = [];
  });

  return channel;
}

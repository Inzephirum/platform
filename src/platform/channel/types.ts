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


export type UnsubFromChannel = () => void;
export type ChannelListener = (message: PlatformMessage) => void;
export type ClientUID = string;

export interface SendOptions {
  self?: boolean;
}

export interface PlatformChannel {
  send(message: PlatformInputMessage, options?: SendOptions): void;
  listen(listener: ChannelListener): UnsubFromChannel;
  getUid(): string;
}

export interface PlatformChannelStrategy {
  send(message: PlatformMessage): void;
  listen(listener: ChannelListener): UnsubFromChannel;
  ready(): Promise<any>;
}

export interface WorkerMessageEvent extends MessageEvent {
  data: PlatformMessage;
}

export interface WorkerExtendableEvent extends ExtendableEvent {
  data: PlatformMessage;
}

import { setupChannelInServiceWorker } from './platform/channel/service-worker-channel';

setupChannelInServiceWorker(self as unknown as ServiceWorkerGlobalScope);

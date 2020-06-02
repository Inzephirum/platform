import { setupChannelInServiceWorker } from './platform';

setupChannelInServiceWorker(self as unknown as ServiceWorkerGlobalScope);

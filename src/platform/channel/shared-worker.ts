
import type { WorkerMessageEvent } from './types';

const worker = self as unknown as SharedWorkerGlobalScope;
const ports: MessagePort[] = []

worker.addEventListener('connect', (e) => {
  const [port] = e.ports;

  ports.push(port);

  port.addEventListener('message', (event: WorkerMessageEvent) => {
    ports.forEach(p => {
      if (p !== port) {
        p.postMessage(event.data);
      }
    })

    port.postMessage(event.data);
  })

  port.start();
});

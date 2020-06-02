import interact from 'interactjs';
import { PlatformMessage, PlatformInputMessage, createChannel } from './platform';

const $form = document.getElementById('signin') as HTMLFormElement;
const $input = document.getElementById('login') as HTMLInputElement;
const $log = document.getElementById('log') as HTMLElement;

const channel = createChannel('test');

navigator.serviceWorker.register('./sw.ts');

function addToLog(type: 'send' | 'receive', message: PlatformMessage) {
  if (message.input.name === 'resize') {
    return;
  }

  const $item = document.createElement('div');
  $item.className = `message ${type}`;
  $item.innerText = `[${type}]: ${JSON.stringify(message, null, 2)}`;
  $log.append($item);
}

channel.listen(message => {
  const type = message.from.uid === channel.getUid() ? 'send' : 'receive';

  addToLog(type, message);

  if (message.input.name === 'resize') {
    const {height, width} = message.input.body;
    $input.style.height =  height ? `${height}px` : 'auto';
    $input.style.width = width ? `${width}px` : 'auto';
  }
});

document.title = `Tab id: ${channel.getUid()}`;

$form.addEventListener('submit', e => {
  e.preventDefault();

  const message: PlatformInputMessage = {
    name: 'submit',
    body: {
      text: $input.value,
    },
  };

  channel.send(message, { self: true });

  $input.value = '';
});

interact($input).resizable({
  axis: 'y',
  listeners: {
    move(event: Interact.InteractEvent) {
      const element = event.target as HTMLTextAreaElement;
      channel.send({
        name: 'resize',
        body: {
          width: element.offsetWidth,
          height: element.offsetHeight,
        },
      });
    },
  },
});

import DOM from './scripts/dom.js';
import download from './scripts/download.js';
import helloSine from './scripts/hello-sine.js';

DOM.id.helloSine.btn.addEventListener('click', async () => {
  DOM.id.helloSine.btn.disabled = true;
  DOM.id.helloSine.btn.innerText = 'running...';

  const { latency, time, blob } = await helloSine();

  DOM.id.helloSine.btn.disabled = false;
  DOM.id.helloSine.btn.innerText = 'start';

  DOM.id.helloSine.output.innerText = latency.toFixed(3) + 'ms';
  DOM.id.helloSine.time.innerText = time.toFixed(3) + 'ms';

  download(blob);
});



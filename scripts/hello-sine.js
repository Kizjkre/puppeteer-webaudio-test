import audioBufferToWav from './audioBufferToWav.js';
import concat from './concat.js';

export default async () => {
  const ctx = new AudioContext();
  await ctx.audioWorklet.addModule('./scripts/recorder.js');
  const helloSine = new OscillatorNode(ctx);
  const recorder = new AudioWorkletNode(ctx, 'recorder');

  helloSine.connect(recorder).connect(ctx.destination);

  const arrays = [];
  recorder.port.onmessage = e => {
    !(e.data.channel in arrays) && (arrays[e.data.channel] = []);
    arrays[e.data.channel].push(e.data.data);
  };

  const start = performance.now();

  helloSine.start();
  helloSine.stop(ctx.currentTime + 1);

  const latency = await new Promise(resolve => helloSine.onended = () => resolve(ctx.baseLatency));

  const end = performance.now();

  const res = [];
  arrays.forEach((array, i) => res[i] = concat(...array));

  const buf = new AudioBuffer({
    length: res[0].byteLength,
    sampleRate: ctx.sampleRate,
    numberOfChannels: res.length
  });

  res.forEach((array, i) => buf.copyToChannel(array, i));

  const blob = audioBufferToWav(buf, false);

  await ctx.close();

  return { latency, time: end - start, blob }
};

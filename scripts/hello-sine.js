import audioBufferToWav from './audioBufferToWav.js';
import record from './recorder/main.js';

export default async () => {
  const ctx = new AudioContext();
  const helloSine = new OscillatorNode(ctx);
  const { recorder, buffer } = await record(ctx, helloSine);

  helloSine.connect(recorder).connect(ctx.destination);

  const start = performance.now();

  helloSine.start();
  helloSine.stop(ctx.currentTime + 1);

  const latency = await new Promise(resolve => helloSine.onended = () => resolve(ctx.baseLatency));

  const end = performance.now();

  const blob = audioBufferToWav(await buffer, false);

  await ctx.close();

  return { latency, time: end - start, blob }
};

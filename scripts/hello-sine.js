import audioBufferToWav from './audioBufferToWav.js';

export default async () => {
  const ctx = new AudioContext();

  const helloSine = new OscillatorNode(ctx);
  const destination = new MediaStreamAudioDestinationNode(ctx);

// helloSine.connect(ctx.destination);
  helloSine.connect(destination);

  const recorder = new MediaRecorder(destination.stream);
  const chunks = [];

  recorder.ondataavailable = e => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  recorder.start();

  const start = performance.now();

  helloSine.start();
  helloSine.stop(ctx.currentTime + 1);

  const latency = await new Promise(resolve => helloSine.onended = () => resolve(ctx.baseLatency));

  const end = performance.now();

  recorder.stop();

  const blob = await new Promise(resolve => recorder.onstop = async () =>
    resolve(audioBufferToWav(await ctx.decodeAudioData(await chunks[0].arrayBuffer()), false)));

  await ctx.close();

  return { latency, time: end - start, blob }
};

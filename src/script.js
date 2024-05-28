(async () => {
  const ctx = new AudioContext();

  // await ctx.audioWorklet.addModule('worklet.js');

  const helloSine = new OscillatorNode(ctx);
  // const bypass = new AudioWorkletNode(ctx, 'bypass-processor');

  // helloSine.connect(bypass).connect(ctx.destination);
  helloSine.connect(ctx.destination);

  const start = performance.now();

  helloSine.start();
  helloSine.stop(ctx.currentTime + 1);

  const latency = await new Promise(resolve => helloSine.onended = () => resolve(ctx.baseLatency));

  const end = performance.now();
  return { latency, time: end - start };
})();

import { SignalSample } from "../processing/signalProcessing";

export function generateTestSignal(
  sampleCount: number = 100
): SignalSample[] {
  const signal: SignalSample[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const noise = Math.random() * 0.08;

    const wave =
      Math.sin(i * 0.25) * 0.25;

    const detectionPeak =
      i > 45 && i < 65 ? 0.75 : 0;

    signal.push({
      time: i * 0.01,
      value:
        noise +
        wave +
        detectionPeak,
    });
  }

  return signal;
}
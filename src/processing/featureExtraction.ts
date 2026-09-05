import {
  SignalSample,
  calculateMean,
  calculatePeak,
  calculateRms,
} from "./signalProcessing";

export type SignalFeatures = {
  mean: number;
  peak: number;
  rms: number;
  range: number;
};

export function extractFeatures(
  signal: SignalSample[]
): SignalFeatures {
  if (signal.length === 0) {
    return {
      mean: 0,
      peak: 0,
      rms: 0,
      range: 0,
    };
  }

  const values = signal.map(
    (sample) => sample.value
  );

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  return {
    mean: calculateMean(signal),
    peak: calculatePeak(signal),
    rms: calculateRms(signal),
    range: maximum - minimum,
  };
}
export type SignalSample = {
  time: number;
  value: number;
};

export function normalizeSignal(
  signal: SignalSample[]
): SignalSample[] {
  if (signal.length === 0) return [];

  const values = signal.map((sample) => sample.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return signal.map((sample) => ({
      ...sample,
      value: 0,
    }));
  }

  return signal.map((sample) => ({
    ...sample,
    value: (sample.value - min) / (max - min),
  }));
}

export function calculateMean(
  signal: SignalSample[]
): number {
  if (signal.length === 0) return 0;

  const sum = signal.reduce(
    (total, sample) => total + sample.value,
    0
  );

  return sum / signal.length;
}

export function calculatePeak(
  signal: SignalSample[]
): number {
  if (signal.length === 0) return 0;

  return Math.max(
    ...signal.map((sample) => sample.value)
  );
}

export function calculateRms(
  signal: SignalSample[]
): number {
  if (signal.length === 0) return 0;

  const squaredSum = signal.reduce(
    (total, sample) =>
      total + sample.value * sample.value,
    0
  );

  return Math.sqrt(squaredSum / signal.length);
}
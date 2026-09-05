import { SignalFeatures } from "./featureExtraction";

export type ClassificationResult = {
  label: string;
  confidence: number;
};

export function classifySignal(
  features: SignalFeatures
): ClassificationResult {
  if (features.peak > 0.75) {
    return {
      label: "Positive Detection",
      confidence: 96,
    };
  }

  if (features.peak > 0.45) {
    return {
      label: "Indeterminate",
      confidence: 72,
    };
  }

  return {
    label: "No Detection",
    confidence: 91,
  };
}
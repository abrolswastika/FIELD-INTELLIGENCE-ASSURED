import {
  normalizeSignal,
  SignalSample,
} from "./signalProcessing";

import {
  extractFeatures,
  SignalFeatures,
} from "./featureExtraction";

import {
  classifySignal,
  ClassificationResult,
} from "./classifier";

export type AnalysisResult = {
  features: SignalFeatures;
  classification: ClassificationResult;
};

export function analyzeSignal(
  signal: SignalSample[]
): AnalysisResult {
  // Step 1: Normalize the raw signal
  const normalizedSignal = normalizeSignal(signal);

  // Step 2: Extract useful signal features
  const features = extractFeatures(normalizedSignal);

  // Step 3: Classify the extracted features
  const classification = classifySignal(features);

  // Step 4: Return complete analysis
  return {
    features,
    classification,
  };
}
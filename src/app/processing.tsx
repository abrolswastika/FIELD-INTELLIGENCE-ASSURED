import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import SignalChart from "../components/SignalChart";
import { SignalSample } from "../processing/signalProcessing";
import { analyzeSignal } from "../processing/pipeline";
import { collectSensorData } from "../services/esp32Service";

export default function ProcessingScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    recordId?: string;
    caseNumber?: string;
    operatorId?: string;
    operatorName?: string;
    sampleDescription?: string;
    reagent?: string;
  }>();

  const [progress, setProgress] = useState(0);
  const [signal, setSignal] = useState<SignalSample[]>([]);
  const [processingStarted, setProcessingStarted] =
    useState(false);

  /*
   * Processing progress
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }

        return Math.min(current + 5, 100);
      });
    }, 350);

    return () => clearInterval(interval);
  }, []);

  /*
   * Generate/acquire signal,
   * analyze it,
   * then move to Result screen.
   */
  useEffect(() => {
    if (progress !== 100 || processingStarted) {
      return;
    }

    setProcessingStarted(true);

    let navigationTimeout: ReturnType<
      typeof setTimeout
    > | null = null;

    const runAnalysis = async () => {
      try {
        /*
         * Currently this uses the simulated ESP32 service.
         *
         * Later collectSensorData() will be replaced
         * with the actual ESP32 sensor communication.
         */
        const generatedSignal =
          await collectSensorData(100);

        setSignal(generatedSignal);

        const analysis =
          analyzeSignal(generatedSignal);

        navigationTimeout = setTimeout(() => {
          router.replace({
            pathname: "/result",
            params: {
              recordId:
                params.recordId || "",
              caseNumber:
                params.caseNumber || "",
              operatorId:
                params.operatorId || "",
              operatorName:
                params.operatorName || "",
              sampleDescription:
                params.sampleDescription || "",
              reagent:
                params.reagent || "",

              signal:
                JSON.stringify(
                  generatedSignal
                ),

              resultLabel:
                analysis.classification.label,

              confidence:
                analysis.classification.confidence.toString(),

              mean:
                analysis.features.mean.toString(),

              peak:
                analysis.features.peak.toString(),

              rms:
                analysis.features.rms.toString(),

              range:
                analysis.features.range.toString(),
            },
          });
        }, 1800);
      } catch (error) {
        console.error(
          "Signal processing failed:",
          error
        );
      }
    };

    runAnalysis();

    return () => {
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
    };
  }, [
    progress,
    processingStarted,
    router,
    params.recordId,
    params.caseNumber,
    params.operatorId,
    params.operatorName,
    params.sampleDescription,
    params.reagent,
  ]);

  const stage =
    progress < 25
      ? "Initializing analysis engine"
      : progress < 50
      ? "Collecting sensor signal"
      : progress < 75
      ? "Extracting signal features"
      : progress < 100
      ? "Classifying field sample"
      : "Analysis complete";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            SRTK ANALYSIS ENGINE
          </Text>

          <Text style={styles.title}>
            Processing
          </Text>

          <Text style={styles.subtitle}>
            Analyzing the acquired sensor signal
            and generating the field result.
          </Text>
        </View>

        {/* PROCESSING CARD */}

        <View style={styles.processingCard}>
          <View style={styles.processingHeader}>
            <View style={styles.spinnerContainer}>
              <ActivityIndicator
                size="large"
                color="#2563EB"
              />
            </View>

            <View style={styles.processingHeaderText}>
              <Text style={styles.processingTitle}>
                {progress === 100
                  ? "Analysis Complete"
                  : "Analyzing Sample"}
              </Text>

              <Text style={styles.processingSubtitle}>
                {stage}
              </Text>
            </View>
          </View>

          {/* PROGRESS */}

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                PROCESSING
              </Text>

              <Text style={styles.progressValue}>
                {progress}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* PIPELINE */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Analysis Pipeline
          </Text>

          <PipelineStep
            number="01"
            title="Sensor Acquisition"
            description="Read field sensor measurements"
            active={progress >= 5}
          />

          <PipelineStep
            number="02"
            title="Signal Processing"
            description="Normalize and clean signal"
            active={progress >= 35}
          />

          <PipelineStep
            number="03"
            title="Feature Extraction"
            description="Calculate signal characteristics"
            active={progress >= 55}
          />

          <PipelineStep
            number="04"
            title="Classification"
            description="Determine detection result"
            active={progress >= 75}
          />

          <PipelineStep
            number="05"
            title="Evidence Generation"
            description="Prepare verified test record"
            active={progress >= 100}
          />
        </View>

        {/* SIGNAL */}

        {signal.length > 0 && (
          <View style={styles.chartContainer}>
            <SignalChart
              signal={signal}
              title="Acquired Sensor Signal"
            />
          </View>
        )}

        {/* TEST INFORMATION */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Test Information
          </Text>

          <InfoRow
            label="Case Number"
            value={
              params.caseNumber || "—"
            }
          />

          <InfoRow
            label="Operator"
            value={
              params.operatorName || "—"
            }
          />

          <InfoRow
            label="Operator ID"
            value={
              params.operatorId || "—"
            }
          />

          <InfoRow
            label="Reagent"
            value={
              params.reagent || "—"
            }
          />
        </View>

        {/* STATUS */}

        <View style={styles.statusCard}>
          <View style={styles.statusDot} />

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              {progress === 100
                ? "Preparing Result"
                : "Processing in Progress"}
            </Text>

            <Text style={styles.statusText}>
              Please wait while the analysis
              engine completes the test.
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            SRTK FIELD INTELLIGENCE
          </Text>

          <Text style={styles.footerText}>
            Automated signal analysis
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ----------------------------------------
// PIPELINE STEP
// ----------------------------------------

function PipelineStep({
  number,
  title,
  description,
  active,
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
}) {
  return (
    <View style={styles.pipelineRow}>
      <View
        style={[
          styles.pipelineNumber,
          active &&
            styles.pipelineNumberActive,
        ]}
      >
        {active ? (
          <Text style={styles.check}>
            ✓
          </Text>
        ) : (
          <Text style={styles.number}>
            {number}
          </Text>
        )}
      </View>

      <View style={styles.pipelineContent}>
        <Text
          style={[
            styles.pipelineTitle,
            active &&
              styles.pipelineTitleActive,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.pipelineDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

// ----------------------------------------
// INFO ROW
// ----------------------------------------

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

// ----------------------------------------
// STYLES
// ----------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 45,
  },

  header: {
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2563EB",
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#64748B",
  },

  processingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  processingHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  spinnerContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  processingHeaderText: {
    flex: 1,
  },

  processingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },

  processingSubtitle: {
    fontSize: 11,
    color: "#64748B",
  },

  progressSection: {
    marginTop: 24,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#94A3B8",
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#2563EB",
  },

  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },

  pipelineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  pipelineNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  pipelineNumberActive: {
    backgroundColor: "#DCFCE7",
  },

  number: {
    fontSize: 9,
    fontWeight: "900",
    color: "#94A3B8",
  },

  check: {
    fontSize: 14,
    fontWeight: "900",
    color: "#16A34A",
  },

  pipelineContent: {
    flex: 1,
  },

  pipelineTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 3,
  },

  pipelineTitleActive: {
    color: "#0F172A",
  },

  pipelineDescription: {
    fontSize: 10,
    color: "#94A3B8",
  },

  chartContainer: {
    marginTop: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "800",
    maxWidth: "60%",
    textAlign: "right",
  },

  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 17,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1E40AF",
    marginBottom: 3,
  },

  statusText: {
    fontSize: 10,
    lineHeight: 15,
    color: "#64748B",
  },

  footer: {
    alignItems: "center",
    marginTop: 30,
  },

  footerTitle: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#64748B",
  },

  footerText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },
});
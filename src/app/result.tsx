import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { saveTestRecord } from "../services/database";
import { generateEvidenceHash } from "../services/crypto";

export default function ResultScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    recordId?: string;
    caseNumber?: string;
    operatorId?: string;
    operatorName?: string;
    sampleDescription?: string;
    reagent?: string;

    resultLabel?: string;
    confidence?: string;
    mean?: string;
    peak?: string;
    rms?: string;
    range?: string;
  }>();

  const recordId =
    params.recordId ||
    `${params.caseNumber || "CASE"}-${Date.now()}`;

  const resultLabel =
    params.resultLabel || "Unknown";

  const confidence = Number(
    params.confidence || 0
  );

  const mean = Number(params.mean || 0);
  const peak = Number(params.peak || 0);
  const rms = Number(params.rms || 0);
  const range = Number(params.range || 0);

  useEffect(() => {
    let active = true;

    async function saveResult() {
      try {
        /*
         * This is the canonical evidence string.
         * The exact same values are used to create
         * the SHA-256 evidence identifier.
         */
        const source = [
          recordId,
          params.caseNumber || "",
          params.operatorId || "",
          params.reagent || "",
          resultLabel,
          confidence,
          mean,
          peak,
          rms,
          range,
        ].join("|");

        const evidenceHash =
          await generateEvidenceHash(source);

        if (!active) return;

        await saveTestRecord({
          recordId,
          caseNumber: params.caseNumber || "",
          operatorId: params.operatorId || "",
          operatorName: params.operatorName || "",
          sampleDescription:
            params.sampleDescription || "",
          reagent: params.reagent || "",
          resultLabel,
          confidence,
          mean,
          peak,
          rms,
          range,
          evidenceHash,
          status: "completed",
        });
      } catch (error) {
        console.error(
          "Failed to save test result:",
          error
        );
      }
    }

    saveResult();

    return () => {
      active = false;
    };
  }, []);

  const viewEvidence = () => {
    router.push({
      pathname: "/evidence",
      params: {
        recordId,
        caseNumber: params.caseNumber || "",
        operatorId: params.operatorId || "",
        operatorName: params.operatorName || "",
        sampleDescription:
          params.sampleDescription || "",
        reagent: params.reagent || "",
        resultLabel,
        confidence: confidence.toString(),
        mean: mean.toString(),
        peak: peak.toString(),
        rms: rms.toString(),
        range: range.toString(),
      },
    } as any);
  };

  const startNewTest = () => {
    router.replace("/setup");
  };

  const returnHome = () => {
    router.replace("/");
  };

  const isPositive =
    resultLabel === "Positive Detection";

  const isIndeterminate =
    resultLabel === "Indeterminate";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          ANALYSIS COMPLETE
        </Text>

        <Text style={styles.title}>
          Test Result
        </Text>

        <Text style={styles.subtitle}>
          The field sample has been successfully
          processed and classified.
        </Text>

        {/* Result Card */}
        <View style={styles.resultCard}>
          <Text style={styles.resultCaption}>
            CLASSIFICATION
          </Text>

          <Text
            style={[
              styles.resultTitle,
              isPositive
                ? styles.positiveText
                : isIndeterminate
                ? styles.indeterminateText
                : styles.negativeText,
            ]}
          >
            {resultLabel}
          </Text>

          <View style={styles.confidenceRow}>
            <View>
              <Text style={styles.confidenceLabel}>
                Confidence
              </Text>

              <Text style={styles.confidenceValue}>
                {confidence.toFixed(0)}%
              </Text>
            </View>

            <View style={styles.confidenceCircle}>
              <Text style={styles.circleText}>
                {confidence.toFixed(0)}
              </Text>

              <Text style={styles.circlePercent}>
                %
              </Text>
            </View>
          </View>
        </View>

        {/* Analysis Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Analysis Summary
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Analysis Status
              </Text>

              <Text style={styles.summaryValue}>
                Complete
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Detection Result
              </Text>

              <Text style={styles.summaryValue}>
                {resultLabel}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Confidence
              </Text>

              <Text style={styles.summaryValue}>
                {confidence.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Signal Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Signal Features
          </Text>

          <View style={styles.featureGrid}>
            <FeatureCard
              label="Mean"
              value={mean}
            />

            <FeatureCard
              label="Peak"
              value={peak}
            />

            <FeatureCard
              label="RMS"
              value={rms}
            />

            <FeatureCard
              label="Range"
              value={range}
            />
          </View>
        </View>

        {/* Test Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Test Details
          </Text>

          <View style={styles.detailsCard}>
            <DetailRow
              label="Case Number"
              value={params.caseNumber || "—"}
            />

            <DetailRow
              label="Operator ID"
              value={params.operatorId || "—"}
            />

            <DetailRow
              label="Operator Name"
              value={params.operatorName || "—"}
            />

            <DetailRow
              label="Sample"
              value={
                params.sampleDescription || "—"
              }
            />

            <DetailRow
              label="Reagent"
              value={params.reagent || "—"}
            />

            <DetailRow
              label="Record ID"
              value={recordId}
              last
            />
          </View>
        </View>

        {/* Evidence */}
        <View style={styles.evidenceCard}>
          <View style={styles.evidenceIcon}>
            <Text style={styles.evidenceIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.evidenceTextContainer}>
            <Text style={styles.evidenceTitle}>
              Evidence Recorded
            </Text>

            <Text style={styles.evidenceSubtitle}>
              Test result, signal features and
              evidence identifier have been stored.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable
          style={styles.primaryButton}
          onPress={viewEvidence}
        >
          <Text style={styles.primaryButtonText}>
            View Evidence
          </Text>

          <Text style={styles.arrow}>→</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={startNewTest}
        >
          <Text style={styles.secondaryButtonText}>
            Start New Field Test
          </Text>
        </Pressable>

        <Pressable
          style={styles.homeButton}
          onPress={returnHome}
        >
          <Text style={styles.homeButtonText}>
            Return Home
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          SRTK Field Intelligence • Secure Field Analysis
        </Text>
      </ScrollView>
    </View>
  );
}

function FeatureCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureLabel}>
        {label}
      </Text>

      <Text style={styles.featureValue}>
        {value.toFixed(3)}
      </Text>
    </View>
  );
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.detailRow,
        !last && styles.detailBorder,
      ]}
    >
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text
        style={styles.detailValue}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 40,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2563EB",
    marginBottom: 8,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#64748B",
    marginBottom: 26,
  },

  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },

  resultCaption: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#94A3B8",
    marginBottom: 8,
  },

  resultTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
  },

  positiveText: {
    color: "#16A34A",
  },

  indeterminateText: {
    color: "#D97706",
  },

  negativeText: {
    color: "#2563EB",
  },

  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  confidenceLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 4,
  },

  confidenceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },

  confidenceCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  circleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563EB",
  },

  circlePercent: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 5,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    maxWidth: "55%",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  featureCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  featureLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 7,
  },

  featureValue: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
  },

  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },

  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  detailLabel: {
    fontSize: 13,
    color: "#64748B",
    width: "38%",
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    width: "58%",
    textAlign: "right",
  },

  evidenceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },

  evidenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  evidenceIconText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  evidenceTextContainer: {
    flex: 1,
  },

  evidenceTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#166534",
    marginBottom: 4,
  },

  evidenceSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#4D7C5A",
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 18,
    marginBottom: 12,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  arrow: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 10,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2563EB",
  },

  homeButton: {
    alignItems: "center",
    paddingVertical: 14,
  },

  homeButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 12,
  },
});
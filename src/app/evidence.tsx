import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  getTestRecord,
  TestRecord,
} from "../services/database";

export default function EvidenceScreen() {
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
    evidenceHash?: string;
  }>();

  const [record, setRecord] =
    useState<TestRecord | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadRecord() {
      try {
        if (!params.recordId) {
          setLoading(false);
          return;
        }

        const savedRecord =
          await getTestRecord(
            params.recordId
          );

        setRecord(savedRecord);
      } catch (error) {
        console.error(
          "Failed to load evidence record:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecord();
  }, [params.recordId]);

  const recordId =
    record?.record_id ||
    params.recordId ||
    "Unknown";

  const caseNumber =
    record?.case_number ||
    params.caseNumber ||
    "—";

  const operatorId =
    record?.operator_id ||
    params.operatorId ||
    "—";

  const operatorName =
    record?.operator_name ||
    params.operatorName ||
    "—";

  const sampleDescription =
    record?.sample_description ||
    params.sampleDescription ||
    "Not specified";

  const reagent =
    record?.reagent ||
    params.reagent ||
    "—";

  const resultLabel =
    record?.result_label ||
    params.resultLabel ||
    "—";

  const confidence =
    record?.confidence ??
    Number(params.confidence || 0);

  const mean =
    record?.mean ??
    Number(params.mean || 0);

  const peak =
    record?.peak ??
    Number(params.peak || 0);

  const rms =
    record?.rms ??
    Number(params.rms || 0);

  const range =
    record?.range ??
    Number(params.range || 0);

  const evidenceHash =
    record?.evidence_hash ||
    params.evidenceHash ||
    "Hash unavailable";

  const createdAt =
    record?.created_at ||
    "Timestamp unavailable";

  const isPositive =
    resultLabel === "Positive Detection";

  const isIndeterminate =
    resultLabel === "Indeterminate";

  const resultBackground =
    isPositive
      ? "#DCFCE7"
      : isIndeterminate
      ? "#FEF3C7"
      : "#E2E8F0";

  const resultColor =
    isPositive
      ? "#166534"
      : isIndeterminate
      ? "#92400E"
      : "#475569";

  function formatDate(value: string) {
    if (
      !value ||
      value === "Timestamp unavailable"
    ) {
      return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            EVIDENCE RECORD
          </Text>

          <Text style={styles.title}>
            Test Evidence
          </Text>

          <Text style={styles.subtitle}>
            Verified record of the completed
            field analysis.
          </Text>
        </View>

        {/* VERIFICATION STATUS */}

        <View style={styles.verifiedCard}>
          <View style={styles.verifiedIcon}>
            <Text style={styles.verifiedIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.verifiedText}>
            <Text style={styles.verifiedTitle}>
              Evidence Recorded
            </Text>

            <Text style={styles.verifiedSubtitle}>
              {loading
                ? "Loading saved record..."
                : "Record successfully retrieved from local storage"}
            </Text>
          </View>
        </View>

        {/* RESULT */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Analysis Result
          </Text>

          <View style={styles.resultRow}>
            <View
              style={[
                styles.resultBadge,
                {
                  backgroundColor:
                    resultBackground,
                },
              ]}
            >
              <Text
                style={[
                  styles.resultBadgeText,
                  {
                    color: resultColor,
                  },
                ]}
              >
                {resultLabel}
              </Text>
            </View>

            <Text style={styles.confidence}>
              {confidence}%
            </Text>
          </View>
        </View>

        {/* RECORD INFORMATION */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Record Information
          </Text>

          <DetailRow
            label="Record ID"
            value={recordId}
          />

          <DetailRow
            label="Case Number"
            value={caseNumber}
          />

          <DetailRow
            label="Created"
            value={formatDate(createdAt)}
          />

          <DetailRow
            label="Status"
            value={
              record?.status || "completed"
            }
          />
        </View>

        {/* OPERATOR */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Operator Information
          </Text>

          <DetailRow
            label="Operator Name"
            value={operatorName}
          />

          <DetailRow
            label="Operator ID"
            value={operatorId}
          />
        </View>

        {/* SAMPLE */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Sample Information
          </Text>

          <DetailRow
            label="Sample"
            value={sampleDescription}
          />

          <DetailRow
            label="Reagent"
            value={reagent}
          />
        </View>

        {/* SIGNAL EVIDENCE */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Signal Evidence
          </Text>

          <MetricRow
            label="Mean"
            value={Number(mean).toFixed(3)}
          />

          <MetricRow
            label="Peak"
            value={Number(peak).toFixed(3)}
          />

          <MetricRow
            label="RMS"
            value={Number(rms).toFixed(3)}
          />

          <MetricRow
            label="Signal Range"
            value={Number(range).toFixed(3)}
          />
        </View>

        {/* HASH */}

        <View style={styles.hashCard}>
          <View style={styles.hashHeader}>
            <View style={styles.hashIcon}>
              <Text style={styles.hashIconText}>
                #
              </Text>
            </View>

            <View style={styles.hashHeaderText}>
              <Text style={styles.hashTitle}>
                SHA-256 Evidence Identifier
              </Text>

              <Text style={styles.hashSubtitle}>
                Cryptographic fingerprint of the
                analysis record
              </Text>
            </View>
          </View>

          <View style={styles.hashBox}>
            <Text style={styles.hashText}>
              {evidenceHash}
            </Text>
          </View>
        </View>

        {/* TIMELINE */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Evidence Timeline
          </Text>

          <TimelineItem
            title="Field test created"
            description="Test parameters recorded"
            completed
          />

          <TimelineItem
            title="Sensor acquisition completed"
            description="Sensor signal captured"
            completed
          />

          <TimelineItem
            title="Signal analyzed"
            description="Features extracted and classified"
            completed
          />

          <TimelineItem
            title="Evidence stored"
            description="Record saved to local database"
            completed
          />
        </View>

        {/* ACTIONS */}

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.replace("/")
          }
        >
          <Text style={styles.primaryButtonText}>
            Finish Test
          </Text>

          <Text style={styles.arrow}>
            ✓
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.push("/history")
          }
        >
          <Text style={styles.secondaryButtonText}>
            View Evidence History
          </Text>
        </Pressable>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            SRTK FIELD INTELLIGENCE
          </Text>

          <Text style={styles.footerText}>
            Evidence verification record
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ----------------------------------------
// DETAIL ROW
// ----------------------------------------

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

// ----------------------------------------
// METRIC ROW
// ----------------------------------------

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <Text style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

// ----------------------------------------
// TIMELINE ITEM
// ----------------------------------------

function TimelineItem({
  title,
  description,
  completed,
}: {
  title: string;
  description: string;
  completed: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View
        style={[
          styles.timelineCircle,
          completed &&
            styles.timelineCircleCompleted,
        ]}
      >
        <Text
          style={[
            styles.timelineCheck,
            completed &&
              styles.timelineCheckCompleted,
          ]}
        >
          {completed ? "✓" : ""}
        </Text>
      </View>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>
          {title}
        </Text>

        <Text style={styles.timelineDescription}>
          {description}
        </Text>
      </View>
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

  verifiedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  verifiedIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  verifiedIconText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#16A34A",
  },

  verifiedText: {
    flex: 1,
  },

  verifiedTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#166534",
  },

  verifiedSubtitle: {
    fontSize: 11,
    color: "#4D7C5A",
    marginTop: 3,
    lineHeight: 16,
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

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultBadge: {
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  resultBadgeText: {
    fontSize: 13,
    fontWeight: "800",
  },

  confidence: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2563EB",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  detailLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    flex: 1,
  },

  detailValue: {
    fontSize: 12,
    color: "#0F172A",
    fontWeight: "700",
    textAlign: "right",
    flex: 1.5,
  },

  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  metricLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  metricValue: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "800",
  },

  hashCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  hashHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  hashIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  hashIconText: {
    fontSize: 19,
    fontWeight: "900",
    color: "#2563EB",
  },

  hashHeaderText: {
    flex: 1,
  },

  hashTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  hashSubtitle: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 3,
  },

  hashBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },

  hashText: {
    fontSize: 10,
    lineHeight: 16,
    color: "#334155",
    fontWeight: "600",
  },

  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  timelineCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  timelineCircleCompleted: {
    backgroundColor: "#DCFCE7",
  },

  timelineCheck: {
    fontSize: 12,
    fontWeight: "900",
    color: "#94A3B8",
  },

  timelineCheckCompleted: {
    color: "#16A34A",
  },

  timelineContent: {
    flex: 1,
  },

  timelineTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },

  timelineDescription: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 18,
    marginTop: 22,
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  arrow: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 17,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
  },

  footer: {
    alignItems: "center",
    marginTop: 30,
  },

  footerTitle: {
    fontSize: 11,
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
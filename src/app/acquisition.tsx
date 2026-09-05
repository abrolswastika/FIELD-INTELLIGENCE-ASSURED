import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AcquisitionScreen() {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }

        return Math.min(current + 5, 100);
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress !== 100) return;

    const timeout = setTimeout(() => {
      router.replace({
        pathname: "/processing",
        params: {
          recordId: params.recordId || "",
          caseNumber: params.caseNumber || "",
          operatorId: params.operatorId || "",
          operatorName: params.operatorName || "",
          sampleDescription: params.sampleDescription || "",
          reagent: params.reagent || "",
        },
      });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [
    progress,
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
      ? "Initializing sensor"
      : progress < 50
      ? "Collecting sample signal"
      : progress < 75
      ? "Acquiring sensor data"
      : progress < 100
      ? "Completing acquisition"
      : "Acquisition complete";

  const cancelTest = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* BACK / CANCEL */}
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.pressed,
          ]}
          onPress={cancelTest}
        >
          <Text style={styles.cancelArrow}>‹</Text>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SENSOR ACQUISITION</Text>

          <Text style={styles.title}>Acquiring Sample</Text>

          <Text style={styles.subtitle}>
            The sensor is collecting the sample signal. Keep the
            device steady until acquisition is complete.
          </Text>
        </View>

        {/* PROGRESS CARD */}
        <View style={styles.progressCard}>
          <View style={styles.sensorCircleOuter}>
            <View style={styles.sensorCircleInner} />
          </View>

          <Text style={styles.progressTitle}>
            {progress === 100
              ? "Acquisition Complete"
              : "Acquiring Sample"}
          </Text>

          <Text style={styles.progressSubtitle}>
            {stage}
          </Text>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Acquisition Progress
            </Text>

            <Text style={styles.progressValue}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        {/* TEST INFORMATION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Test Information
          </Text>

          <InfoRow
            label="Case Number"
            value={params.caseNumber || "—"}
          />

          <InfoRow
            label="Operator"
            value={params.operatorName || "—"}
          />

          <InfoRow
            label="Sample"
            value={params.sampleDescription || "—"}
          />

          <InfoRow
            label="Reagent"
            value={params.reagent || "—"}
            last
          />
        </View>

        {/* ACQUISITION STEPS */}
        <View style={styles.card}>
          <Step
            title="Sensor initialization"
            active={progress >= 5}
          />

          <Step
            title="Signal collection"
            active={progress >= 30}
          />

          <Step
            title="Sensor data acquisition"
            active={progress >= 55}
          />

          <Step
            title="Acquisition complete"
            active={progress >= 100}
            last
          />
        </View>

        {/* INFO MESSAGE */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>i</Text>
          </View>

          <Text style={styles.infoText}>
            You will be automatically redirected to the
            processing stage shortly.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            SRTK FIELD INTELLIGENCE
          </Text>

          <Text style={styles.footerText}>
            Automated sensor acquisition
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({
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
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >
      <Text style={styles.infoLabel}>{label}</Text>

      <Text
        style={styles.infoValue}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

function Step({
  title,
  active,
  last = false,
}: {
  title: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.stepRow,
        !last && styles.stepBorder,
      ]}
    >
      <View
        style={[
          styles.stepCircle,
          active && styles.stepCircleActive,
        ]}
      >
        {active ? (
          <Text style={styles.check}>✓</Text>
        ) : (
          <View style={styles.emptyDot} />
        )}
      </View>

      <Text
        style={[
          styles.stepText,
          active && styles.stepTextActive,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 45,
    paddingBottom: 80,
  },

  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 30,
  },

  cancelArrow: {
    fontSize: 34,
    lineHeight: 30,
    color: "#0F172A",
    marginRight: 5,
    fontWeight: "400",
  },

  cancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  pressed: {
    opacity: 0.6,
  },

  header: {
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#2563EB",
    marginBottom: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#64748B",
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sensorCircleOuter: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 25,
  },

  sensorCircleInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2563EB",
  },

  progressTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 6,
  },

  progressSubtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 35,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#475569",
  },

  progressValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2563EB",
  },

  progressTrack: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 54,
    paddingVertical: 11,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  infoLabel: {
    fontSize: 15,
    color: "#64748B",
    flex: 1,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
    textAlign: "right",
    maxWidth: "58%",
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 62,
  },

  stepBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  stepCircleActive: {
    backgroundColor: "#2563EB",
  },

  check: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },

  emptyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CBD5E1",
  },

  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#94A3B8",
  },

  stepTextActive: {
    color: "#334155",
    fontWeight: "800",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoIconText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    fontStyle: "italic",
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
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
    marginTop: 5,
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  connectESP32,
  getESP32Status,
  ESP32Status,
} from "../services/esp32Service";

export default function ReadyScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    recordId?: string;
    caseNumber?: string;
    operatorId?: string;
    operatorName?: string;
    sampleDescription?: string;
    reagent?: string;
  }>();

  const [deviceStatus, setDeviceStatus] =
    useState<ESP32Status>(getESP32Status());

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    setDeviceStatus(getESP32Status());
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setDeviceStatus("connecting");

    try {
      const connected = await connectESP32();

      if (connected) {
        setDeviceStatus("connected");
      } else {
        setDeviceStatus("disconnected");
      }
    } catch (error) {
      console.error("ESP32 connection error:", error);
      setDeviceStatus("disconnected");
    } finally {
      setConnecting(false);
    }
  };

  const startAcquisition = () => {
    if (deviceStatus !== "connected") {
      return;
    }

    router.push({
      pathname: "/acquisition",
      params: {
        recordId: params.recordId || "",
        caseNumber: params.caseNumber || "",
        operatorId: params.operatorId || "",
        operatorName: params.operatorName || "",
        sampleDescription: params.sampleDescription || "",
        reagent: params.reagent || "",
      },
    });
  };

  const goBack = () => {
    router.back();
  };

  const statusLabel =
    deviceStatus === "connected"
      ? "CONNECTED"
      : deviceStatus === "connecting"
      ? "CONNECTING"
      : "OFFLINE";

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SRTK SENSOR INTERFACE</Text>

          <Text style={styles.title}>Sensor Ready</Text>

          <Text style={styles.subtitle}>
            Connect the SRTK sensor unit before beginning field acquisition.
          </Text>
        </View>

        {/* DEVICE CARD */}
        <View style={styles.deviceCard}>
          <View style={styles.deviceTop}>
            <View style={styles.deviceIcon}>
              <Text style={styles.deviceIconText}>S</Text>
            </View>

            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>SRTK Sensor Unit</Text>

              <Text style={styles.deviceDescription}>
                Field signal acquisition device
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                deviceStatus === "connected" &&
                  styles.connectedBadge,
                deviceStatus === "connecting" &&
                  styles.connectingBadge,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  deviceStatus === "connected" &&
                    styles.connectedDot,
                  deviceStatus === "connecting" &&
                    styles.connectingDot,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  deviceStatus === "connected" &&
                    styles.connectedText,
                ]}
              >
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* CONNECT BUTTON */}
          {deviceStatus !== "connected" && (
            <Pressable
              style={({ pressed }) => [
                styles.connectButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />

                  <Text style={styles.connectButtonText}>
                    CONNECTING...
                  </Text>
                </>
              ) : (
                <Text style={styles.connectButtonText}>
                  CONNECT SENSOR
                </Text>
              )}
            </Pressable>
          )}

          {/* CONNECTED MESSAGE */}
          {deviceStatus === "connected" && (
            <View style={styles.connectedMessage}>
              <View style={styles.successCircle}>
                <Text style={styles.successCheck}>✓</Text>
              </View>

              <View style={styles.connectedMessageContent}>
                <Text style={styles.connectedMessageTitle}>
                  Sensor Connected
                </Text>

                <Text style={styles.connectedMessageText}>
                  The SRTK sensor is ready for field acquisition.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* TEST CONFIGURATION */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            TEST CONFIGURATION
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
            label="Operator ID"
            value={params.operatorId || "—"}
          />

          <InfoRow
            label="Reagent"
            value={params.reagent || "—"}
          />

          <InfoRow
            label="Sample"
            value={params.sampleDescription || "—"}
            last
          />
        </View>

        {/* INSTRUCTIONS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            ACQUISITION INSTRUCTIONS
          </Text>

          <Instruction
            number="01"
            text="Ensure the sensor unit is powered on."
          />

          <Instruction
            number="02"
            text="Place the prepared sample in the sensor."
          />

          <Instruction
            number="03"
            text="Keep the sensor stable during acquisition."
          />

          <Instruction
            number="04"
            text="Start acquisition when the system is ready."
          />
        </View>

        {/* START BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            deviceStatus !== "connected" &&
              styles.startButtonDisabled,
            pressed &&
              deviceStatus === "connected" &&
              styles.buttonPressed,
          ]}
          onPress={startAcquisition}
          disabled={deviceStatus !== "connected"}
        >
          <View>
            <Text
              style={[
                styles.startButtonLabel,
                deviceStatus !== "connected" &&
                  styles.disabledText,
              ]}
            >
              FIELD ACQUISITION
            </Text>

            <Text
              style={[
                styles.startButtonText,
                deviceStatus !== "connected" &&
                  styles.disabledText,
              ]}
            >
              Start Acquisition
            </Text>
          </View>

          <View
            style={[
              styles.arrowCircle,
              deviceStatus !== "connected" &&
                styles.arrowCircleDisabled,
            ]}
          >
            <Text
              style={[
                styles.arrow,
                deviceStatus !== "connected" &&
                  styles.disabledArrow,
              ]}
            >
              →
            </Text>
          </View>
        </Pressable>

        {/* BACK BUTTON */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={goBack}
        >
          <Text style={styles.backButtonText}>
            ← Back to Test Setup
          </Text>
        </Pressable>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            SRTK FIELD INTELLIGENCE
          </Text>

          <Text style={styles.footerText}>
            Secure field acquisition platform
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

      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Instruction({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <View style={styles.instructionRow}>
      <View style={styles.instructionNumber}>
        <Text style={styles.instructionNumberText}>
          {number}
        </Text>
      </View>

      <Text style={styles.instructionText}>
        {text}
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
    paddingBottom: 45,
  },

  header: {
    marginBottom: 24,
  },

  eyebrow: {
    fontSize: 11,
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

  deviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  deviceTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  deviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  deviceIconText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2563EB",
  },

  deviceInfo: {
    flex: 1,
  },

  deviceName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },

  deviceDescription: {
    fontSize: 10,
    color: "#94A3B8",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 8,
  },

  connectingBadge: {
    backgroundColor: "#FEF3C7",
  },

  connectedBadge: {
    backgroundColor: "#DCFCE7",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#94A3B8",
    marginRight: 5,
  },

  connectingDot: {
    backgroundColor: "#F59E0B",
  },

  connectedDot: {
    backgroundColor: "#22C55E",
  },

  statusText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.7,
    color: "#64748B",
  },

  connectedText: {
    color: "#166534",
  },

  connectButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
  },

  connectButtonText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    color: "#FFFFFF",
    marginLeft: 8,
  },

  connectedMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 13,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },

  successCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  successCheck: {
    fontSize: 17,
    fontWeight: "900",
    color: "#16A34A",
  },

  connectedMessageContent: {
    flex: 1,
  },

  connectedMessageTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#166534",
    marginBottom: 3,
  },

  connectedMessageText: {
    fontSize: 10,
    lineHeight: 15,
    color: "#64748B",
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
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.3,
    color: "#94A3B8",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
    maxWidth: "60%",
    textAlign: "right",
  },

  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },

  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  instructionNumberText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#64748B",
  },

  instructionText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: "#64748B",
  },

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563EB",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 20,
  },

  startButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  startButtonLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#BFDBFE",
    marginBottom: 4,
  },

  startButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  disabledText: {
    color: "#64748B",
  },

  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  arrowCircleDisabled: {
    backgroundColor: "#B8C3D1",
  },

  arrow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  disabledArrow: {
    color: "#64748B",
  },

  backButton: {
    alignItems: "center",
    paddingVertical: 17,
    marginTop: 8,
  },

  backButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  footer: {
    alignItems: "center",
    marginTop: 25,
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
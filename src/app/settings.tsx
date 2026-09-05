import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const router = useRouter();

  function showAbout() {
    Alert.alert(
      "SRTK Field Intelligence",
      "Version 1.0.0\n\nField testing, signal processing, classification, and evidence management."
    );
  }

  function showDeviceStatus() {
    Alert.alert(
      "Device Status",
      "Sensor System: Ready\nConnection: Online\nAcquisition: Available"
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/" as any)}
        >
          <Text style={styles.backArrow}>‹</Text>

          <Text style={styles.backText}>
            Home
          </Text>
        </Pressable>

        <Text style={styles.eyebrow}>
          SYSTEM CONFIGURATION
        </Text>

        <Text style={styles.title}>
          Settings
        </Text>

        <Text style={styles.subtitle}>
          Manage system information and device status.
        </Text>

        {/* Device */}
        <Text style={styles.sectionTitle}>
          Device
        </Text>

        <View style={styles.card}>
          <SettingRow
            title="Sensor System"
            subtitle="Field acquisition hardware"
            right={
              <View style={styles.readyBadge}>
                <View style={styles.greenDot} />

                <Text style={styles.readyText}>
                  Ready
                </Text>
              </View>
            }
          />

          <SettingRow
            title="Connection"
            subtitle="Communication status"
            right={
              <Text style={styles.onlineText}>
                Online
              </Text>
            }
          />

          <Pressable
            style={styles.actionRow}
            onPress={showDeviceStatus}
          >
            <View>
              <Text style={styles.actionTitle}>
                Device Status
              </Text>

              <Text style={styles.actionSubtitle}>
                View current system status
              </Text>
            </View>

            <Text style={styles.arrow}>
              →
            </Text>
          </Pressable>
        </View>

        {/* Application */}
        <Text style={styles.sectionTitle}>
          Application
        </Text>

        <View style={styles.card}>
          <SettingRow
            title="Application Version"
            subtitle="Current software version"
            right={
              <Text style={styles.value}>
                1.0.0
              </Text>
            }
          />

          <SettingRow
            title="Analysis Engine"
            subtitle="Signal processing and classification"
            right={
              <Text style={styles.activeText}>
                Active
              </Text>
            }
          />

          <SettingRow
            title="Evidence Storage"
            subtitle="Local test record database"
            right={
              <Text style={styles.activeText}>
                Active
              </Text>
            }
          />
        </View>

        {/* Information */}
        <Text style={styles.sectionTitle}>
          Information
        </Text>

        <View style={styles.card}>
          <Pressable
            style={styles.actionRow}
            onPress={showAbout}
          >
            <View>
              <Text style={styles.actionTitle}>
                About SRTK
              </Text>

              <Text style={styles.actionSubtitle}>
                Application information
              </Text>
            </View>

            <Text style={styles.arrow}>
              →
            </Text>
          </Pressable>
        </View>

        {/* Warning */}
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Field Use Notice
          </Text>

          <Text style={styles.noticeText}>
            This application currently uses simulated
            sensor acquisition for development and
            testing. Hardware integration can be
            connected to the acquisition layer later.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            SRTK Field Intelligence
          </Text>

          <Text style={styles.footerVersion}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingSubtitle}>
          {subtitle}
        </Text>
      </View>

      {right}
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
    paddingTop: 48,
    paddingBottom: 45,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backArrow: {
    fontSize: 36,
    lineHeight: 36,
    color: "#0F172A",
    marginRight: 6,
  },

  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  eyebrow: {
    fontSize: 13,
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
    fontSize: 16,
    lineHeight: 24,
    color: "#64748B",
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 13,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  settingRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  settingText: {
    flex: 1,
    marginRight: 15,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 4,
  },

  settingSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
  },

  readyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },

  readyText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#166534",
  },

  onlineText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#16A34A",
  },

  value: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  activeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },

  actionRow: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#334155",
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
  },

  arrow: {
    fontSize: 25,
    color: "#2563EB",
  },

  notice: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  noticeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E40AF",
    marginBottom: 7,
  },

  noticeText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#1D4ED8",
  },

  footer: {
    alignItems: "center",
    paddingTop: 5,
  },

  footerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#475569",
    marginBottom: 5,
  },

  footerVersion: {
    fontSize: 11,
    color: "#94A3B8",
  },
});
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../constants/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();
  const { theme, mode, setMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.systemLabel,
                { color: theme.colors.primary },
              ]}
            >
              SRTK SYSTEM
            </Text>

            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
              ]}
            >
              Field Intelligence
            </Text>

            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Portable evidence analysis platform
            </Text>
          </View>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: theme.colors.success,
              },
            ]}
          />
        </View>

        {/* APPEARANCE */}
        <View
          style={[
            styles.themeCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.themeHeader}>
            <View>
              <Text
                style={[
                  styles.themeTitle,
                  { color: theme.colors.text },
                ]}
              >
                Appearance
              </Text>

              <Text
                style={[
                  styles.themeSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Choose how the app looks
              </Text>
            </View>
          </View>

          <View style={styles.themeOptions}>
            {(["light", "dark", "system"] as const).map(
              (option) => {
                const selected = mode === option;

                return (
                  <Pressable
                    key={option}
                    onPress={() => setMode(option)}
                    style={[
                      styles.themeOption,
                      {
                        backgroundColor: selected
                          ? theme.colors.primary
                          : theme.colors.background,
                        borderColor: selected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeOptionText,
                        {
                          color: selected
                            ? theme.colors.white
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {option === "light"
                        ? "☀️ Light"
                        : option === "dark"
                        ? "🌙 Dark"
                        : "📱 System"}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        </View>

        {/* SYSTEM READY CARD */}
        <View
          style={[
            styles.readyCard,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.readyTop}>
            <View
              style={[
                styles.readyIcon,
                {
                  backgroundColor:
                    theme.colors.successLight,
                },
              ]}
            >
              <Text style={styles.readyIconText}>✓</Text>
            </View>

            <View style={styles.readyTextContainer}>
              <Text
                style={[
                  styles.readyTitle,
                  { color: theme.colors.text },
                ]}
              >
                System Ready
              </Text>

              <Text
                style={[
                  styles.readySubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                All systems operational
              </Text>
            </View>

            <View
              style={[
                styles.onlineBadge,
                {
                  backgroundColor:
                    theme.colors.successLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.onlineText,
                  { color: theme.colors.successDark },
                ]}
              >
                ONLINE
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.divider },
            ]}
          />

          <View style={styles.systemRow}>
            <View style={styles.systemItem}>
              <Text
                style={[
                  styles.systemItemLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                SENSOR
              </Text>

              <Text
                style={[
                  styles.systemItemValue,
                  { color: theme.colors.text },
                ]}
              >
                Ready
              </Text>
            </View>

            <View style={styles.systemItem}>
              <Text
                style={[
                  styles.systemItemLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                DATABASE
              </Text>

              <Text
                style={[
                  styles.systemItemValue,
                  { color: theme.colors.text },
                ]}
              >
                Ready
              </Text>
            </View>

            <View style={styles.systemItem}>
              <Text
                style={[
                  styles.systemItemLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                SECURITY
              </Text>

              <Text
                style={[
                  styles.systemItemValue,
                  { color: theme.colors.text },
                ]}
              >
                Active
              </Text>
            </View>
          </View>
        </View>

        {/* NEW FIELD TEST */}
        <Pressable
          onPress={() => router.push("/setup")}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: theme.colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.primaryButtonTitle,
                { color: theme.colors.white },
              ]}
            >
              New Field Test
            </Text>

            <Text
              style={[
                styles.primaryButtonSubtitle,
                { color: "#DBEAFE" },
              ]}
            >
              Start a new evidence analysis
            </Text>
          </View>

          <Text
            style={[
              styles.buttonArrow,
              { color: theme.colors.white },
            ]}
          >
            →
          </Text>
        </Pressable>

        {/* EVIDENCE HISTORY */}
        <Pressable
          onPress={() => router.push("/history")}
          style={({ pressed }) => [
            styles.historyButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.historyIcon,
              {
                backgroundColor: theme.colors.primaryLight,
              },
            ]}
          >
            <Text
              style={[
                styles.historyIconText,
                { color: theme.colors.primary },
              ]}
            >
              ▣
            </Text>
          </View>

          <View style={styles.historyTextContainer}>
            <Text
              style={[
                styles.historyTitle,
                { color: theme.colors.text },
              ]}
            >
              Evidence History
            </Text>

            <Text
              style={[
                styles.historySubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              View previous field test records
            </Text>
          </View>

          <Text
            style={[
              styles.historyArrow,
              { color: theme.colors.textMuted },
            ]}
          >
            →
          </Text>
        </Pressable>

        {/* CAPABILITIES */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text },
            ]}
          >
            Capabilities
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            Field intelligence tools
          </Text>
        </View>

        <View style={styles.capabilitiesGrid}>
          {/* SENSOR */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: theme.colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.featureIconText,
                  { color: theme.colors.primary },
                ]}
              >
                ◉
              </Text>
            </View>

            <Text
              style={[
                styles.featureTitle,
                { color: theme.colors.text },
              ]}
            >
              Sensor
            </Text>

            <Text
              style={[
                styles.featureDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Real-time sensor acquisition
            </Text>
          </View>

          {/* ANALYSIS */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: theme.colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.featureIconText,
                  { color: theme.colors.primary },
                ]}
              >
                ◇
              </Text>
            </View>

            <Text
              style={[
                styles.featureTitle,
                { color: theme.colors.text },
              ]}
            >
              Analysis
            </Text>

            <Text
              style={[
                styles.featureDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Automated signal processing
            </Text>
          </View>

          {/* EVIDENCE */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: theme.colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.featureIconText,
                  { color: theme.colors.primary },
                ]}
              >
                #
              </Text>
            </View>

            <Text
              style={[
                styles.featureTitle,
                { color: theme.colors.text },
              ]}
            >
              Evidence
            </Text>

            <Text
              style={[
                styles.featureDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Tamper-evident evidence hashing
            </Text>
          </View>

          {/* REPORTING */}
          <View
            style={[
              styles.featureCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: theme.colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.featureIconText,
                  { color: theme.colors.primary },
                ]}
              >
                ≡
              </Text>
            </View>

            <Text
              style={[
                styles.featureTitle,
                { color: theme.colors.text },
              ]}
            >
              Reporting
            </Text>

            <Text
              style={[
                styles.featureDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Structured evidence reports
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: theme.colors.textMuted },
            ]}
          >
            SRTK FIELD INTELLIGENCE
          </Text>

          <Text
            style={[
              styles.footerVersion,
              { color: theme.colors.textMuted },
            ]}
          >
            v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 50,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  systemLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 6,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 8,
  },

  /* THEME */

  themeCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  themeTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  themeSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  themeOptions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },

  themeOption: {
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  themeOptionText: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* READY CARD */

  readyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },

  readyTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  readyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  readyIconText: {
    fontSize: 21,
    fontWeight: "800",
    color: "#166534",
  },

  readyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  readyTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  readySubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  onlineBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  onlineText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  divider: {
    height: 1,
    marginVertical: 16,
  },

  systemRow: {
    flexDirection: "row",
  },

  systemItem: {
    flex: 1,
  },

  systemItemLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  systemItemValue: {
    fontSize: 12,
    fontWeight: "700",
  },

  /* PRIMARY BUTTON */

  primaryButton: {
    minHeight: 72,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  primaryButtonTitle: {
    fontSize: 16,
    fontWeight: "800",
  },

  primaryButtonSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },

  buttonArrow: {
    fontSize: 25,
    fontWeight: "400",
  },

  /* HISTORY */

  historyButton: {
    minHeight: 68,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  historyIconText: {
    fontSize: 18,
    fontWeight: "800",
  },

  historyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },

  historyTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  historySubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  historyArrow: {
    fontSize: 21,
    marginLeft: 10,
  },

  /* SECTION */

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  /* CAPABILITIES */

  capabilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  featureCard: {
    width: "48%",
    minHeight: 150,
    borderRadius: 16,
    borderWidth: 1,
    padding: 15,
  },

  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  featureIconText: {
    fontSize: 18,
    fontWeight: "800",
  },

  featureTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },

  featureDescription: {
    fontSize: 11,
    lineHeight: 16,
  },

  /* FOOTER */

  footer: {
    alignItems: "center",
    marginTop: 32,
  },

  footerText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  footerVersion: {
    fontSize: 9,
    marginTop: 4,
  },
});
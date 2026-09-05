import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function SetupScreen() {
  const router = useRouter();

  const [caseNumber, setCaseNumber] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [operatorName, setOperatorName] = useState("");
  const [sampleDescription, setSampleDescription] =
    useState("");
  const [reagent, setReagent] = useState("");

  const canStart =
    caseNumber.trim().length > 0 &&
    operatorId.trim().length > 0 &&
    operatorName.trim().length > 0 &&
    reagent.trim().length > 0;

  function startTest() {
    if (!canStart) {
      return;
    }

    const recordId = `${caseNumber.trim()}-${Date.now()}`;

    router.push({
      pathname: "/ready",
      params: {
        recordId,
        caseNumber: caseNumber.trim(),
        operatorId: operatorId.trim(),
        operatorName: operatorName.trim(),
        sampleDescription: sampleDescription.trim(),
        reagent: reagent.trim(),
      },
    } as any);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>
            Back
          </Text>
        </Pressable>

        <Text style={styles.eyebrow}>
          FIELD TEST
        </Text>

        <Text style={styles.title}>
          Test Setup
        </Text>

        <Text style={styles.subtitle}>
          Enter the case and operator information
          before starting the field acquisition.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Case Information
          </Text>

          <InputField
            label="Case Number"
            placeholder="e.g. CASE-001"
            value={caseNumber}
            onChangeText={setCaseNumber}
            required
          />

          <InputField
            label="Sample Description"
            placeholder="e.g. Blood Sample"
            value={sampleDescription}
            onChangeText={setSampleDescription}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Operator Information
          </Text>

          <InputField
            label="Operator ID"
            placeholder="e.g. OP-001"
            value={operatorId}
            onChangeText={setOperatorId}
            required
          />

          <InputField
            label="Operator Name"
            placeholder="Enter operator name"
            value={operatorName}
            onChangeText={setOperatorName}
            required
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Test Configuration
          </Text>

          <InputField
            label="Reagent"
            placeholder="e.g. SRTK Reagent"
            value={reagent}
            onChangeText={setReagent}
            required
          />
        </View>

        <View style={styles.notice}>
          <View style={styles.noticeIcon}>
            <Text style={styles.noticeIconText}>
              i
            </Text>
          </View>

          <Text style={styles.noticeText}>
            Verify all case information before
            beginning acquisition.
          </Text>
        </View>

        <Pressable
          style={[
            styles.startButton,
            !canStart && styles.startButtonDisabled,
          ]}
          onPress={startTest}
          disabled={!canStart}
        >
          <Text
            style={[
              styles.startButtonText,
              !canStart &&
                styles.startButtonTextDisabled,
            ]}
          >
            Begin Field Test
          </Text>

          <Text
            style={[
              styles.startArrow,
              !canStart &&
                styles.startButtonTextDisabled,
            ]}
          >
            →
          </Text>
        </Pressable>

        <Text style={styles.requiredText}>
          * Required fields
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  required?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
        {required ? " *" : ""}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
      />
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
    paddingBottom: 40,
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
    marginBottom: 26,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 18,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },

  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  noticeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  noticeIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#475569",
  },

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2563EB",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  startButtonDisabled: {
    backgroundColor: "#E2E8F0",
  },

  startButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  startButtonTextDisabled: {
    color: "#94A3B8",
  },

  startArrow: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  requiredText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 12,
  },
});
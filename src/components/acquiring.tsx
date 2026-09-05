import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import StatusCard from '../components/StatusCard';
import ProgressBar from '../components/ProgressBar';

export default function AcquiringScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }

        return current + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        router.push("/processing" as any);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress, router]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <Text style={styles.title}>
        ACQUIRING
      </Text>

      <Text style={styles.subtitle}>
        Collecting data from the connected device.
      </Text>

      <StatusCard
        title="ACQUISITION ACTIVE"
        status="Mock ESP32"
        connected={true}
      />

      <View style={styles.progressCard}>
        <Text style={styles.label}>
          PROGRESS
        </Text>

        <Text style={styles.progressText}>
          {progress}%
        </Text>

        <ProgressBar progress={progress} />
      </View>

      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Please wait while the demonstration data is acquired.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginTop: 30,
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 30,
  },

  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    marginTop: 18,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },

  progressText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
  },

  messageContainer: {
    marginTop: 24,
    alignItems: 'center',
  },

  message: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
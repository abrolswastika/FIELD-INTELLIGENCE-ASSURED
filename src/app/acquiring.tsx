import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

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

      <View style={styles.card}>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />

          <View>
            <Text style={styles.statusTitle}>
              ACQUISITION ACTIVE
            </Text>

            <Text style={styles.statusText}>
              Mock ESP32
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>
          PROGRESS
        </Text>

        <Text style={styles.progressText}>
          {progress}%
        </Text>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%` },
            ]}
          />
        </View>

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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    marginRight: 14,
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  statusText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
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

  progressBackground: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 16,
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 5,
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
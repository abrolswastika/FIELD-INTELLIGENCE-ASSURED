import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatusCardProps = {
  title: string;
  status: string;
  connected?: boolean;
};

export default function StatusCard({
  title,
  status,
  connected = true,
}: StatusCardProps) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor: connected ? '#22C55E' : '#EF4444',
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.status}>
          {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,

    elevation: 2,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  status: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
});
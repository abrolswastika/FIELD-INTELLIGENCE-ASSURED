import React from 'react';
import { View, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({
  progress,
}: ProgressBarProps) {
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  return (
    <View style={styles.background}>
      <View
        style={[
          styles.progress,
          {
            width: `${safeProgress}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 12,
  },

  progress: {
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 5,
  },
});
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import { SignalSample } from "../processing/signalProcessing";

type SignalChartProps = {
  signal: SignalSample[];
  title?: string;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SignalChart({
  signal,
  title = "Signal Analysis",
}: SignalChartProps) {
  const chartWidth = SCREEN_WIDTH - 84;
  const chartHeight = 190;

  if (!signal || signal.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>

        <View
          style={[
            styles.emptyChart,
            {
              height: chartHeight,
            },
          ]}
        >
          <Text style={styles.emptyText}>
            No signal data available
          </Text>
        </View>
      </View>
    );
  }

  const values = signal.map(
    (sample) => sample.value
  );

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);

  const valueRange =
    maximum - minimum === 0
      ? 1
      : maximum - minimum;

  const points = signal.map((sample, index) => {
    const x =
      (index / Math.max(signal.length - 1, 1)) *
      chartWidth;

    const normalized =
      (sample.value - minimum) / valueRange;

    const y =
      chartHeight -
      normalized * chartHeight;

    return {
      x,
      y,
    };
  });

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {title}
          </Text>

          <Text style={styles.subtitle}>
            Sensor signal waveform
          </Text>
        </View>

        <View style={styles.signalBadge}>
          <View style={styles.signalDot} />

          <Text style={styles.signalBadgeText}>
            SIGNAL
          </Text>
        </View>
      </View>

      {/* CHART */}
      <View
        style={[
          styles.chart,
          {
            width: chartWidth,
            height: chartHeight,
          },
        ]}
      >
        {/* Horizontal grid */}
        <View
          style={[
            styles.gridLine,
            {
              top: chartHeight * 0.25,
            },
          ]}
        />

        <View
          style={[
            styles.gridLine,
            {
              top: chartHeight * 0.5,
            },
          ]}
        />

        <View
          style={[
            styles.gridLine,
            {
              top: chartHeight * 0.75,
            },
          ]}
        />

        {/* Vertical grid */}
        <View
          style={[
            styles.verticalGridLine,
            {
              left: chartWidth * 0.25,
            },
          ]}
        />

        <View
          style={[
            styles.verticalGridLine,
            {
              left: chartWidth * 0.5,
            },
          ]}
        />

        <View
          style={[
            styles.verticalGridLine,
            {
              left: chartWidth * 0.75,
            },
          ]}
        />

        {/* Signal waveform */}
        {points.map((point, index) => {
          if (index === 0) {
            return null;
          }

          const previous = points[index - 1];

          const dx = point.x - previous.x;
          const dy = point.y - previous.y;

          const length = Math.sqrt(
            dx * dx + dy * dy
          );

          const angle =
            Math.atan2(dy, dx) *
            (180 / Math.PI);

          return (
            <View
              key={`signal-${index}`}
              style={[
                styles.signalSegment,
                {
                  width: length,
                  left: previous.x,
                  top: previous.y,
                  transform: [
                    {
                      rotate: `${angle}deg`,
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>

      {/* AXIS */}
      <View style={styles.axis}>
        <Text style={styles.axisText}>
          0
        </Text>

        <Text style={styles.axisText}>
          {Math.floor(signal.length / 2)}
        </Text>

        <Text style={styles.axisText}>
          {signal.length}
        </Text>
      </View>

      {/* STATS */}
      <View style={styles.stats}>
        <Stat
          label="MIN"
          value={minimum.toFixed(3)}
        />

        <Stat
          label="MAX"
          value={maximum.toFixed(3)}
        />

        <Stat
          label="SAMPLES"
          value={signal.length.toString()}
        />
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>
        {label}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },

  signalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginLeft: 10,
  },

  signalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
    marginRight: 5,
  },

  signalBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#166534",
    letterSpacing: 0.8,
  },

  chart: {
    position: "relative",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    overflow: "hidden",
  },

  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  verticalGridLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#E2E8F0",
  },

  signalSegment: {
    position: "absolute",
    height: 2,
    backgroundColor: "#2563EB",
  },

  axis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 6,
  },

  axisText: {
    fontSize: 9,
    color: "#94A3B8",
  },

  stats: {
    flexDirection: "row",
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  emptyChart: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
  },
});
export type ESP32Status =
  | "disconnected"
  | "connecting"
  | "connected";

export type SensorReading = {
  time: number;
  value: number;
};

let status: ESP32Status = "disconnected";

/**
 * Get current ESP32 status
 */
export function getESP32Status(): ESP32Status {
  return status;
}

/**
 * Simulate connecting to ESP32
 */
export async function connectESP32(): Promise<boolean> {
  status = "connecting";

  // Simulate connection delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  status = "connected";

  return true;
}

/**
 * Disconnect ESP32
 */
export function disconnectESP32(): void {
  status = "disconnected";
}

/**
 * Check whether ESP32 is connected
 */
export function isESP32Connected(): boolean {
  return status === "connected";
}

/**
 * Generate simulated sensor data
 *
 * This will later be replaced with
 * actual ESP32 sensor readings.
 */
export async function collectSensorData(
  sampleCount: number = 100
): Promise<SensorReading[]> {
  if (!isESP32Connected()) {
    throw new Error("ESP32 is not connected");
  }

  const readings: SensorReading[] = [];

  for (let i = 0; i < sampleCount; i++) {
    // Sensor noise
    const noise = Math.random() * 0.08;

    // Base signal
    const wave = Math.sin(i * 0.25) * 0.25;

    // Simulated detection peak
    const detectionPeak =
      i > 45 && i < 65 ? 0.75 : 0;

    readings.push({
      time: i * 0.01,
      value: noise + wave + detectionPeak,
    });

    // Simulate sensor sampling delay
    await new Promise((resolve) =>
      setTimeout(resolve, 10)
    );
  }

  return readings;
}
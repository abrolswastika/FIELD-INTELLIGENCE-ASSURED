import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(
      "srtk-field-intelligence.db"
    );
  }

  return dbPromise;
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS test_records (
      record_id TEXT PRIMARY KEY NOT NULL,
      case_number TEXT NOT NULL,
      operator_id TEXT NOT NULL,
      operator_name TEXT NOT NULL,
      sample_description TEXT,
      reagent TEXT NOT NULL,
      created_at TEXT NOT NULL,
      result_label TEXT NOT NULL,
      confidence REAL NOT NULL,
      mean REAL NOT NULL DEFAULT 0,
      peak REAL NOT NULL DEFAULT 0,
      rms REAL NOT NULL DEFAULT 0,
      range REAL NOT NULL DEFAULT 0,
      evidence_hash TEXT,
      status TEXT NOT NULL
    );
  `);

  // Add columns if an older database already exists.
  try {
    await db.execAsync(
      `ALTER TABLE test_records ADD COLUMN mean REAL NOT NULL DEFAULT 0;`
    );
  } catch {}

  try {
    await db.execAsync(
      `ALTER TABLE test_records ADD COLUMN peak REAL NOT NULL DEFAULT 0;`
    );
  } catch {}

  try {
    await db.execAsync(
      `ALTER TABLE test_records ADD COLUMN rms REAL NOT NULL DEFAULT 0;`
    );
  } catch {}

  try {
    await db.execAsync(
      `ALTER TABLE test_records ADD COLUMN range REAL NOT NULL DEFAULT 0;`
    );
  } catch {}

  try {
    await db.execAsync(
      `ALTER TABLE test_records ADD COLUMN evidence_hash TEXT;`
    );
  } catch {}
}

export type TestRecord = {
  record_id: string;
  case_number: string;
  operator_id: string;
  operator_name: string;
  sample_description: string;
  reagent: string;
  created_at: string;
  result_label: string;
  confidence: number;
  mean: number;
  peak: number;
  rms: number;
  range: number;
  evidence_hash: string | null;
  status: string;
};

export async function saveTestRecord(record: {
  recordId: string;
  caseNumber: string;
  operatorId: string;
  operatorName: string;
  sampleDescription: string;
  reagent: string;
  resultLabel: string;
  confidence: number;
  mean?: number;
  peak?: number;
  rms?: number;
  range?: number;
  evidenceHash?: string;
  status: string;
}) {
  const db = await getDatabase();

  await initDatabase();

  await db.runAsync(
    `
      INSERT OR REPLACE INTO test_records (
        record_id,
        case_number,
        operator_id,
        operator_name,
        sample_description,
        reagent,
        created_at,
        result_label,
        confidence,
        mean,
        peak,
        rms,
        range,
        evidence_hash,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    record.recordId,
    record.caseNumber,
    record.operatorId,
    record.operatorName,
    record.sampleDescription,
    record.reagent,
    new Date().toISOString(),
    record.resultLabel,
    record.confidence,
    record.mean ?? 0,
    record.peak ?? 0,
    record.rms ?? 0,
    record.range ?? 0,
    record.evidenceHash ?? null,
    record.status
  );
}

export async function getTestRecords(): Promise<TestRecord[]> {
  const db = await getDatabase();

  await initDatabase();

  return await db.getAllAsync<TestRecord>(
    `
      SELECT *
      FROM test_records
      ORDER BY created_at DESC
    `
  );
}

/**
 * Get one evidence/test record by record ID.
 */
export async function getTestRecord(
  recordId: string
): Promise<TestRecord | null> {
  const db = await getDatabase();

  await initDatabase();

  const record = await db.getFirstAsync<TestRecord>(
    `
      SELECT *
      FROM test_records
      WHERE record_id = ?
      LIMIT 1
    `,
    recordId
  );

  return record ?? null;
}
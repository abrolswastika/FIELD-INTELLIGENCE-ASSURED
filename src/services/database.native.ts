import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("srtk-field-intelligence.db");
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
      result_label TEXT,
      confidence REAL,
      status TEXT NOT NULL
    );
  `);
}

export async function saveTestRecord(record: {
  recordId: string;
  caseNumber: string;
  operatorId: string;
  operatorName: string;
  sampleDescription: string;
  reagent: string;
  resultLabel: string;
  confidence: number;
  status: string;
}) {
  const db = await getDatabase();

  await initDatabase();

  await db.runAsync(
    `
      INSERT OR IGNORE INTO test_records (
        record_id,
        case_number,
        operator_id,
        operator_name,
        sample_description,
        reagent,
        created_at,
        result_label,
        confidence,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    record.status
  );
}

export async function getTestRecords() {
  const db = await getDatabase();

  await initDatabase();

  const records = await db.getAllAsync<{
    record_id: string;
    case_number: string;
    operator_id: string;
    operator_name: string;
    sample_description: string;
    reagent: string;
    created_at: string;
    result_label: string;
    confidence: number;
    status: string;
  }>(
    `
      SELECT *
      FROM test_records
      ORDER BY created_at DESC
    `
  );

  return records;
}
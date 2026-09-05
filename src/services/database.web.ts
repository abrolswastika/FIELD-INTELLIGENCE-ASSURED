import type {
  TestRecord,
  SaveTestRecord,
} from "./database.types";

const STORAGE_KEY = "srtk-test-records";

function getRecords(): TestRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as TestRecord[];
  } catch (error) {
    console.error(
      "Failed to read test records:",
      error
    );

    return [];
  }
}

function setRecords(records: TestRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(records)
    );
  } catch (error) {
    console.error(
      "Failed to save test records:",
      error
    );
  }
}

export async function initDatabase() {
  return;
}

export async function saveTestRecord(
  record: SaveTestRecord
) {
  const records = getRecords();

  const newRecord: TestRecord = {
    record_id: record.recordId,
    case_number: record.caseNumber,
    operator_id: record.operatorId,
    operator_name: record.operatorName,
    sample_description:
      record.sampleDescription,
    reagent: record.reagent,
    created_at: new Date().toISOString(),
    result_label: record.resultLabel,
    confidence: record.confidence,
    status: record.status,
  };

  const existingIndex = records.findIndex(
    (item) =>
      item.record_id === newRecord.record_id
  );

  if (existingIndex >= 0) {
    records[existingIndex] = newRecord;
  } else {
    records.unshift(newRecord);
  }

  setRecords(records);
}

export async function getTestRecords(): Promise<
  TestRecord[]
> {
  return getRecords();
}
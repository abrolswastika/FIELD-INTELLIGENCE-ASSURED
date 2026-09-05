export type TestRecord = {
  id: string;
  date: string;
  time: string;
  result: string;
  device: string;
};

export const testHistory: TestRecord[] = [];
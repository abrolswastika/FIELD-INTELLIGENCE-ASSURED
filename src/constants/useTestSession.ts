import { useState } from 'react';
import { testHistory, TestRecord } from '../constants/testData';

export function useTestSession() {
  const [history, setHistory] = useState<TestRecord[]>(testHistory);

  const addTest = (result: string) => {
    const now = new Date();

    const newTest: TestRecord = {
      id: now.getTime().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      result,
      device: 'Mock ESP32',
    };

    testHistory.unshift(newTest);
    setHistory([...testHistory]);
  };

  return {
    history,
    addTest,
  };
}
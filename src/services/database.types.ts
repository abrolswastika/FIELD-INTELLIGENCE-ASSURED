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
  status: string;
};

export type SaveTestRecord = {
  recordId: string;
  caseNumber: string;
  operatorId: string;
  operatorName: string;
  sampleDescription: string;
  reagent: string;
  resultLabel: string;
  confidence: number;
  status: string;
};
// types/assessment.ts

export interface FormData {
  age: number | null;
  gender: "male" | "female" | "unspecified" | null;
  priorExposure: boolean | null;
  conditions: string[];
}

export type FormDataValue = string | number | boolean | null | string[];

export interface Condition {
  id: string;
  label: string;
}

export interface Recommendation {
  vaccine: string;
  reason: string;
  alertType?: "destructive" | "success";
}
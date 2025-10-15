// types/assessment.ts

export interface FormData {
  birthDate: Date | string | null;
  province: string | null;
  conditions: string[];
}

export type FormDataValue = string | Date | null | string[];

export interface Condition {
  id: string;
  label: string;
}

export interface Province {
  name: string;
  region: string;
  recommendation: string;
}

export interface Recommendation {
  vaccine: string;
  reason: string;
  alertType?: "destructive" | "success";
}

export interface DetailedRecommendation {
  overall: Recommendation;
  age: {
    category: string;
    recommendation: string;
    reason: string;
    result: string;
  };
  healthConditions: Array<{
    condition: string;
    recommendation: string;
    reason: string | null;
    result: string;
  }>;
  location: {
    province: string;
    region: string;
    recommendation: string;
  };
}
// constants/conditions.ts

import { Condition } from "@/types/assessment";

export const medicalConditions: Condition[] = [
  { id: "pregnant", label: "หญิงตั้งครรภ์" },
  { id: "chronicDisease", label: "โรคหัวใจ, โรคเบาหวาน, โรคปอดอุดกั้นเรื้อรัง" },
  { id: "liverDisease", label: "โรคตับเรื้อรัง" },
  { id: "kidneyDisease", label: "โรคไตเรื้อรัง" },
  { id: "spleenDisorder", label: "บุคคลที่ไม่มีม้าม หรือม้ามทำงานบกพร่อง" },
  { id: "hivLowCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≤ 200 uL)" },
  { id: "hivHighCD4", label: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≥ 200 uL)" },
  { id: "immunodeficiency", label: "บุคคลที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง" },
  { id: "transplant", label: "บุคคลที่ปลูกถ่ายอวัยวะหรือไขกระดูก" },
];

export const staffCondition: Condition = { 
  id: "medicalStaff", 
  label: "บุคลากรทางการแพทย์" 
};

export const noneCondition: Condition = { 
  id: "none", 
  label: "ไม่มีภาวะดังกล่าวข้างบน" 
};

export const conditionLabels: Record<string, string> = {
  pregnant: "หญิงตั้งครรภ์",
  medicalStaff: "บุคลากรทางการแพทย์",
  chronicDisease: "โรคหัวใจ, โรคเบาหวาน, โรคปอดอุดกั้นเรื้อรัง",
  liverDisease: "โรคตับเรื้อรัง",
  kidneyDisease: "โรคไตเรื้อรัง",
  spleenDisorder: "บุคคลที่ไม่มีม้าม หรือม้ามทำงานบกพร่อง",
  hivLowCD4: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≤ 200 uL)",
  hivHighCD4: "ติดเชื้อไวรัสเอชไอวี (ระดับ CD4+ ≥ 200 uL)",
  immunodeficiency: "บุคคลที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง",
  transplant: "บุคคลที่ปลูกถ่ายอวัยวะหรือไขกระดูก",
  hajj: "ผู้ที่จะเดินทางไปประกอบพิธีฮัจย์ อุมเราะห์",
  none: "ไม่มีภาวะดังกล่าวข้างบน"
};
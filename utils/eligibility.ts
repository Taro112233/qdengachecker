// utils/eligibility.ts

import { FormData, Recommendation } from "@/types/assessment";

export function getRecommendation(formData: FormData): Recommendation {
  const { age, conditions } = formData;

  // Check critical conditions first
  if (conditions.includes("pregnant")) {
    return {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "วัคซีน Qdenga ไม่แนะนำสำหรับหญิงตั้งครรภ์ เนื่องจากข้อมูลด้านความปลอดภัยยังมีจำกัด",
      alertType: "destructive"
    };
  }

  if (conditions.includes("immunodeficiency") || 
      conditions.includes("hivLowCD4") || 
      conditions.includes("transplant")) {
    return {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "ผู้ที่มีภาวะภูมิคุ้มกันบกพร่องรุนแรง ผู้ที่มีระดับ CD4+ ต่ำ หรือผู้ที่ได้รับการปลูกถ่ายอวัยวะ มีความเสี่ยงสูงต่อการติดเชื้อและอาจไม่ตอบสนองต่อวัคซีนอย่างเพียงพอ",
      alertType: "destructive"
    };
  }

  // Age-based recommendations
  if (age !== null) {
    if (age < 4) {
      return {
        vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
        reason: "วัคซีน Qdenga ไม่ได้รับการอนุมัติสำหรับเด็กอายุต่ำกว่า 4 ปี",
        alertType: "destructive"
      };
    }
  }

  // Default case
  return {
    vaccine: "แนะนำให้ฉีดวัคซีน Qdenga ",
    reason: "วัคซีนมีประสิทธิภาพในการลดความรุนแรงของการติดเชื้อครั้งแรกและการติดเชื้อซ้ำ",
    alertType: "success"
  };
}
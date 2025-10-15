// utils/eligibility.ts

import { FormData, DetailedRecommendation } from "@/types/assessment";
import { healthRecommendations, conditionLabels } from "@/constants/conditions";
import { getProvinceData } from "@/constants/provinces";

function calculateAge(birthDate: Date | string): number {
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function getAgeCategory(age: number): { category: string; recommendation: string; reason: string; result: string } {
  if (age < 4) {
    return {
      category: "< 4 ปี",
      result: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      recommendation: "วัคซีน Qdenga ไม่ได้รับการอนุมัติสำหรับเด็กอายุต่ำกว่า 4 ปี",
      reason: ""
    };
  } else if (age >= 4 && age <= 14) {
    return {
      category: "4 - 14 ปี",
      result: "แนะนำให้ฉีดวัคซีน Qdenga ",
      recommendation: "อายุอยู่ในช่วงที่มีการป่วยของไข้เลือดออกสูงที่สุด (อายุ 4-15 ปี)",
      reason: "ตามคำแนะนำของกรมควบคุมโรค แนะนำให้รับวัคซีนไข้เลือดออกในช่วงอายุ 10-14 ปี ได้รับประโยชน์สูงสุด"
    };
  } else if (age >= 15 && age <= 44) {
    return {
      category: "15 - 44 ปี",
      result: "แนะนำให้ฉีดวัคซีน Qdenga ",
      recommendation: "ผู้เสียชีวิตจากไข้เลือดออก 80% เป็นกลุ่มผู้ใหญ่และผู้สูงอายุ",
      reason: "อายุในช่วง 15 - 44 ปี เพิ่มอัตราการเสียชีวิตจากไข้เลือดออก 2-3 เท่า เมื่อเปรียบเทียบกับเด็ก (อายุน้อยกว่า 14 ปี)"
    };
  } else {
    return {
      category: "> 45 ปี",
      result: "แนะนำให้ฉีดวัคซีน Qdenga ",
      recommendation: "ผู้เสียชีวิตจากไข้เลือดออก 80% เป็นกลุ่มผู้ใหญ่และผู้สูงอายุ",
      reason: "อายุในช่วง 45 ปีขึ้นไป เพิ่มอัตราการเสียชีวิตจากไข้เลือดออก 5-10 เท่า เมื่อเปรียบเทียบกับเด็ก (อายุน้อยกว่า 14 ปี)"
    };
  }
}

export function getDetailedRecommendation(formData: FormData): DetailedRecommendation {
  const age = formData.birthDate ? calculateAge(formData.birthDate) : 0;
  const ageInfo = getAgeCategory(age);
  
  // Check health conditions
  const healthConditions = formData.conditions
    .filter(c => c !== "none" && c !== "medicalStaff")
    .map(conditionId => {
      const conditionData = healthRecommendations[conditionId];
      return {
        condition: conditionLabels[conditionId],
        recommendation: conditionData?.recommendation || "",
        reason: conditionData?.reason || null,
        result: conditionData?.result || ""
      };
    });
  
  // Get province info
  const provinceData = formData.province ? getProvinceData(formData.province) : null;
  const locationInfo = {
    province: formData.province || "",
    region: provinceData?.region || "",
    recommendation: provinceData?.recommendation || ""
  };
  
  // Determine overall recommendation
  const hasContraindication = formData.conditions.some(c => 
    ["pregnant", "immunodeficiency", "hivLowCD4", "transplant"].includes(c)
  );
  
  let overallRecommendation;
  
  if (age < 4) {
    overallRecommendation = {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "วัคซีน Qdenga ไม่ได้รับการอนุมัติสำหรับเด็กอายุต่ำกว่า 4 ปี",
      alertType: "destructive" as const
    };
  } else if (hasContraindication) {
    const contraindicationReasons = formData.conditions
      .filter(c => ["pregnant", "immunodeficiency", "hivLowCD4", "transplant"].includes(c))
      .map(c => healthRecommendations[c]?.recommendation)
      .filter(Boolean);
    
    overallRecommendation = {
      vaccine: "ไม่แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: contraindicationReasons[0] || "มีข้อห้ามใช้วัคซีน",
      alertType: "destructive" as const
    };
  } else {
    overallRecommendation = {
      vaccine: "แนะนำให้ฉีดวัคซีน Qdenga ",
      reason: "วัคซีนมีประสิทธิภาพในการลดความรุนแรงของการติดเชื้อครั้งแรกและการติดเชื้อซ้ำ",
      alertType: "success" as const
    };
  }
  
  return {
    overall: overallRecommendation,
    age: ageInfo,
    healthConditions,
    location: locationInfo
  };
}
// components/assessment/ResultDisplay.tsx

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FormData } from "@/types/assessment";
import { conditionLabels } from "@/constants/conditions";
import { getDetailedRecommendation } from "@/utils/eligibility";

type ResultDisplayProps = {
  formData: FormData;
};

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

export function ResultDisplay({ formData }: ResultDisplayProps) {
  const detailedRec = getDetailedRecommendation(formData);
  const age = formData.birthDate ? calculateAge(formData.birthDate) : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">ผลการประเมิน</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div>
          <h3 className="mb-3 font-bold text-lg">ผลการประเมินโดยรวม</h3>
          <Alert variant={detailedRec.overall.alertType}>
            <AlertTitle className="text-lg font-bold">
              {detailedRec.overall.vaccine}
            </AlertTitle>
            <AlertDescription>{detailedRec.overall.reason}</AlertDescription>
          </Alert>
        </div>

        <Separator />

        {/* Detailed Information */}
        <div>
          <h3 className="mb-4 font-bold text-lg">ข้อมูลของท่าน</h3>

          {/* Age Section */}
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-base mb-2 text-blue-900">1. อายุ</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">อายุปัจจุบัน:</span>{" "}
                <span className="text-blue-800">{age} ปี</span>
                {" "}(หมวดหมู่: {detailedRec.age.category})
              </p>
              <p>
                <span className="font-semibold">ผลการประเมิน:</span>{" "}
                <Badge 
                  className={
                    detailedRec.age.result.includes("ไม่แนะนำ")
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                >
                  {detailedRec.age.result}
                </Badge>
              </p>
              <div className="pt-2">
                <p className="font-semibold mb-1">คำแนะนำ:</p>
                <p className="text-gray-700">{detailedRec.age.recommendation}</p>
                {detailedRec.age.reason && (
                  <>
                    <p className="font-semibold mt-2 mb-1">เหตุผล:</p>
                    <p className="text-gray-700">{detailedRec.age.reason}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Health Conditions Section */}
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <h4 className="font-bold text-base mb-3 text-purple-900">
              2. สภาวะหรือโรคประจำตัว
            </h4>
            {detailedRec.healthConditions.length > 0 ? (
              <div className="space-y-4">
                {detailedRec.healthConditions.map((condition, idx) => (
                  <div key={idx} className="border-l-4 border-purple-300 pl-3 py-1">
                    <p className="font-semibold text-sm mb-1">{condition.condition}</p>
                    <p className="text-sm mb-1">
                      <span className="font-semibold">ผลการประเมิน:</span>{" "}
                      <Badge 
                        className={
                          condition.result.includes("ไม่แนะนำ")
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }
                      >
                        {condition.result}
                      </Badge>
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">คำแนะนำ:</span> {condition.recommendation}
                    </p>
                    {condition.reason && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold">เหตุผล:</span> {condition.reason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">ไม่มีข้อมูลโรคประจำตัว</p>
            )}
          </div>

          {/* Location Section */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-bold text-base mb-2 text-amber-900">3. สถานที่</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">จังหวัด:</span>{" "}
                <span className="text-amber-800">{detailedRec.location.province}</span>
              </p>
              <p>
                <span className="font-semibold">ภูมิภาค:</span>{" "}
                <span className="text-amber-800">{detailedRec.location.region}</span>
              </p>
              {detailedRec.location.recommendation && (
                <div className="pt-2">
                  <p className="font-semibold mb-1">สถานการณ์ไข้เลือดออก:</p>
                  <p className="text-gray-700">{detailedRec.location.recommendation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Disclaimer */}
        <div className="bg-blue-50 p-4 rounded-md text-blue-900">
          <p className="text-sm">
            <strong>คำเตือน:</strong> ข้อมูลนี้ใช้เพื่อเป็นแนวทางเบื้องต้นเท่านั้น
            โปรดปรึกษาแพทย์หรือบุคลากรทางการแพทย์เพื่อรับคำแนะนำที่เหมาะสมกับสถานการณ์ของท่าน
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Link href="/">
          <Button>
            เสร็จสิ้น
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
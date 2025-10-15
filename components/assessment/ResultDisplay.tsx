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
import { getRecommendation } from "@/utils/eligibility";

type ResultDisplayProps = {
  formData: FormData;
};

export function ResultDisplay({ formData }: ResultDisplayProps) {
  const recommendation = getRecommendation(formData);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold">ผลการประเมิน</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert variant={recommendation.alertType}>
          <AlertTitle className="text-lg font-bold">{recommendation.vaccine}</AlertTitle>
          <AlertDescription>{recommendation.reason}</AlertDescription>
        </Alert>

        <Separator />

        <div>
          <h3 className="mb-2 font-bold text-lg">ข้อมูลของท่าน</h3>

          <div className="space-y-2">
            <p><span className="font-bold">อายุ :</span>{" "}
              <span className="text-blue-800">{formData.age} ปี</span>
            </p>

            <p>
              <span className="font-bold">เพศ :</span>{" "}
              <span className="text-blue-800">
                {formData.gender === "male" ? "ชาย" :
                  formData.gender === "female" ? "หญิง" : "ไม่ระบุ"}
              </span>
            </p>

            <div>
              <span className="font-bold">โรคประจำตัว :</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {formData.conditions.length > 0 ? (
                  formData.conditions.map(condition => (
                    <Badge key={condition} variant="secondary">
                      {conditionLabels[condition]}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">ไม่ได้ระบุ</span>
                )}
              </div>
            </div>
          </div>
        </div>

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
// components/assessment/ResultDisplay.tsx

"use client";

import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FormData } from "@/types/assessment";
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
  const isRecommended = !detailedRec.overall.vaccine.includes("ไม่แนะนำ");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="space-y-6">
        {/* Overall Assessment */}
        <div>
          <h3 className="mb-6 font-bold text-lg">ผลการประเมินโดยรวม</h3>
          
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6
              }}
            >
              {isRecommended ? (
                <CheckCircle className="w-24 h-24 text-green-600 mb-4" />
              ) : (
                <XCircle className="w-24 h-24 text-red-600 mb-4" />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h4 className={`text-2xl font-bold mb-3 ${
                isRecommended ? "text-green-600" : "text-red-600"
              }`}>
                {detailedRec.overall.vaccine}
              </h4>
            </motion.div>
          </div>
        </div>

        <Separator />

        {/* Detailed Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="mb-4 font-bold text-lg">ข้อมูลของท่าน</h3>

          {/* Age Section */}
          <motion.div 
            className="mb-6 bg-blue-50 p-4 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h4 className="font-bold text-base mb-3 text-blue-900">1. อายุ</h4>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">อายุปัจจุบัน:</span>{" "}
                <span className="text-blue-800">{age} ปี</span>
              </p>
              <p className="text-gray-700">
                {detailedRec.age.recommendation}
              </p>
              <p className="flex items-center gap-2">
                {detailedRec.age.result.includes("ไม่แนะนำ") ? (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span className="text-red-600 font-medium">
                      {detailedRec.age.result}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-green-600 font-medium">
                      {detailedRec.age.result}
                    </span>
                  </>
                )}
              </p>
              {detailedRec.age.reason && (
                <div className="pt-2 border-t border-blue-200">
                  <p className="font-semibold mb-1">ข้อมูลเพิ่มเติม:</p>
                  <p className="text-gray-700">{detailedRec.age.reason}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Health Conditions Section */}
          <motion.div 
            className="mb-6 bg-purple-50 p-4 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <h4 className="font-bold text-base mb-3 text-purple-900">
              2. สภาวะหรือโรคประจำตัว
            </h4>
            {detailedRec.healthConditions.length > 0 ? (
              <>
                <div className="space-y-4 mb-4">
                  {(() => {
                    // Group conditions by recommendation + reason combination
                    const groupedConditions = detailedRec.healthConditions.reduce((acc, condition) => {
                      const key = `${condition.recommendation}|||${condition.reason || ''}|||${condition.result}`;
                      if (!acc[key]) {
                        acc[key] = {
                          conditions: [],
                          recommendation: condition.recommendation,
                          reason: condition.reason,
                          result: condition.result
                        };
                      }
                      acc[key].conditions.push(condition.condition);
                      return acc;
                    }, {} as Record<string, { conditions: string[], recommendation: string, reason: string | null, result: string }>);

                    return Object.values(groupedConditions).map((group, idx) => (
                      <div key={idx} className="border-l-4 border-purple-300 pl-3 py-2 space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {group.conditions.map((conditionName, condIdx) => (
                            <Badge 
                              key={condIdx} 
                              className="text-sm bg-black text-white hover:bg-gray-800"
                            >
                              {conditionName}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-700">
                          {group.recommendation}
                        </p>
                        <p className="text-sm flex items-center gap-2">
                          {group.result.includes("ไม่แนะนำ") ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                              <span className="text-red-600 font-normal">
                                {group.result}
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-green-600 font-normal">
                                {group.result}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    ));
                  })()}
                </div>

                {/* Display unique reasons at the bottom */}
                {(() => {
                  const uniqueReasons = Array.from(
                    new Set(
                      detailedRec.healthConditions
                        .map(c => c.reason)
                        .filter(Boolean)
                    )
                  );

                  if (uniqueReasons.length > 0) {
                    return (
                      <div className="pt-3 border-t border-purple-200">
                        <p className="font-semibold text-sm mb-2 text-purple-900">คำแนะนำ:</p>
                        <div className="space-y-2">
                          {uniqueReasons.map((reason, idx) => (
                            <p key={idx} className="text-sm text-gray-700 pl-3 border-l-2 border-purple-200">
                              {reason}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
              <p className="text-sm text-gray-600">ไม่มีข้อมูลโรคประจำตัว</p>
            )}
          </motion.div>

          {/* Location Section */}
          <motion.div 
            className="bg-amber-50 p-4 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <h4 className="font-bold text-base mb-2 text-amber-900">3. จังหวัดที่อาศัย</h4>
            <div className="space-y-2 text-sm">
              {detailedRec.location.recommendation && (
                <div className="pt-2 bg-white/50 p-3 rounded-md">
                  <p>
                    <span className="font-semibold">จังหวัด:</span>{" "}
                    <span className="text-amber-800">{detailedRec.location.province}</span>
                  </p>
                  <p className="text-gray-700">{detailedRec.location.recommendation}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        <Separator />

        {/* Disclaimer */}
        <motion.div 
          className="bg-blue-50 p-4 rounded-md text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <p className="text-sm">
            <strong>คำเตือน:</strong> ข้อมูลนี้ใช้เพื่อเป็นแนวทางเบื้องต้นเท่านั้น
            โปรดปรึกษาแพทย์หรือบุคลากรทางการแพทย์เพื่อรับคำแนะนำที่เหมาะสมกับสถานการณ์ของท่าน
          </p>
        </motion.div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.4 }}
        >
          <Link href="/">
            <Button className="px-8">
              เสร็จสิ้น
            </Button>
          </Link>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
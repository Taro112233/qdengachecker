// components/assessment/MedicalConditionsStep.tsx

"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormData, FormDataValue } from "@/types/assessment";
import { medicalConditions, staffCondition, noneCondition } from "@/constants/conditions";
import { getRecommendation } from "@/utils/eligibility";

type MedicalConditionsStepProps = {
  formData: FormData;
  updateData: (field: string, value: FormDataValue) => void;
  onNext: () => void;
  onBack: () => void;
};

export function MedicalConditionsStep({
  formData,
  updateData,
  onNext,
  onBack
}: MedicalConditionsStepProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    formData.conditions || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCondition = (id: string) => {
    let updatedConditions = [...selectedConditions];

    if (id === "none") {
      if (!updatedConditions.includes("none")) {
        updatedConditions = updatedConditions.filter(c => c === "medicalStaff");
        updatedConditions.push("none");
      } else {
        updatedConditions = updatedConditions.filter(c => c !== "none");
      }
    } else if (id === "medicalStaff") {
      if (updatedConditions.includes(id)) {
        updatedConditions = updatedConditions.filter(c => c !== id);
      } else {
        updatedConditions.push(id);
      }
    } else {
      updatedConditions = updatedConditions.filter(c => c !== "none");
      
      if (updatedConditions.includes(id)) {
        updatedConditions = updatedConditions.filter(c => c !== id);
      } else {
        updatedConditions.push(id);
      }
    }

    setSelectedConditions(updatedConditions);
    updateData("conditions", updatedConditions);
  };

  const handleCheck = async () => {
    try {
      setIsSubmitting(true);
      
      const recommendation = getRecommendation({
        ...formData,
        conditions: selectedConditions
      });
      
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          conditions: selectedConditions,
          recommendation: recommendation.vaccine,
          reason: recommendation.reason
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment');
      }
      
      onNext();
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold">สภาวะหรือโรคประจำตัว</CardTitle>
        <CardDescription className="font-medium">
          กรุณาเลือกในช่องที่ตรงกับสภาวะหรือโรคของท่านในปัจจุบัน
        </CardDescription>
        <Badge variant="secondary" className="w-fit mt-1">
          สามารถเลือกได้มากกว่า 1 ข้อ
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-4">
            {medicalConditions.map((condition) => (
              <div key={condition.id} className="flex items-start space-x-3">
                <Checkbox
                  id={condition.id}
                  checked={selectedConditions.includes(condition.id)}
                  onCheckedChange={() => toggleCondition(condition.id)}
                />
                <Label 
                  htmlFor={condition.id} 
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id={noneCondition.id}
                checked={selectedConditions.includes(noneCondition.id)}
                onCheckedChange={() => toggleCondition(noneCondition.id)}
              />
              <Label 
                htmlFor={noneCondition.id} 
                className="text-sm leading-none text-green-700"
              >
                {noneCondition.label}
              </Label>
            </div>
          </div>

          <div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id={staffCondition.id}
                checked={selectedConditions.includes(staffCondition.id)}
                onCheckedChange={() => toggleCondition(staffCondition.id)}
              />
              <Label 
                htmlFor={staffCondition.id} 
                className="text-sm leading-none text-blue-800"
              >
                {staffCondition.label}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          ย้อนกลับ
        </Button>
        <Button
          onClick={handleCheck}
          disabled={selectedConditions.length === 0 || isSubmitting}
        >
          {isSubmitting ? "กำลังประมวลผล..." : "ตรวจสอบ"}
        </Button>
      </CardFooter>
    </Card>
  );
}
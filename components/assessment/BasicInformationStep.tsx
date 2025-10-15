// components/assessment/BasicInformationStep.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormData, FormDataValue } from "@/types/assessment";
import { User, UserRound, Users, Check, X } from "lucide-react";

type BasicInformationStepProps = {
  formData: FormData;
  updateData: (field: string, value: FormDataValue) => void;
  onNext: () => void;
};

export function BasicInformationStep({
  formData,
  updateData,
  onNext
}: BasicInformationStepProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const valid =
      formData.age !== null &&
      formData.gender !== null &&
      formData.priorExposure !== null;

    setIsValid(valid);
  }, [formData]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">ข้อมูลพื้นฐาน</CardTitle>
        <CardDescription>
          กรุณากรอกข้อมูลพื้นฐานของคุณเพื่อช่วยเราประเมินความเหมาะสมในการฉีดวัคซีน
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="age">1. อายุ</Label>
          <Input
            id="age"
            type="number"
            placeholder="กรอกอายุของคุณ"
            value={formData.age || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              updateData('age', value);
            }}
            min={0}
            max={120}
            className="text-center"
          />
        </div>

        <div className="space-y-4">
          <Label>2. เพศ</Label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={formData.gender === 'male' ? "default" : "outline"}
              onClick={() => updateData('gender', 'male')}
              className="w-full flex items-center justify-center gap-2"
            >
              <User className="h-4 w-4" />
              ชาย
            </Button>
            <Button
              type="button"
              variant={formData.gender === 'female' ? "default" : "outline"}
              onClick={() => updateData('gender', 'female')}
              className="w-full flex items-center justify-center gap-2"
            >
              <UserRound className="h-4 w-4" />
              หญิง
            </Button>
            <Button
              type="button"
              variant={formData.gender === 'unspecified' ? "default" : "outline"}
              onClick={() => updateData('gender', 'unspecified')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Users className="h-4 w-4" />
              ไม่ระบุ
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>3. มีคนใกล้ชิดของคุณเคยเป็นไข้เลือดออกหรือไม่?</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={formData.priorExposure === true ? "default" : "outline"}
              onClick={() => updateData('priorExposure', true)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              ใช่
            </Button>
            <Button
              type="button"
              variant={formData.priorExposure === false ? "default" : "outline"}
              onClick={() => updateData('priorExposure', false)}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              ไม่ใช่
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!isValid}
        >
          ถัดไป
        </Button>
      </CardFooter>
    </Card>
  );
}
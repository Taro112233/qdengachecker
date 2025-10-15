// components/assessment/BirthDateStep.tsx

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

type BirthDateStepProps = {
  formData: FormData;
  updateData: (field: string, value: FormDataValue) => void;
  onNext: () => void;
};

export function BirthDateStep({
  formData,
  updateData,
  onNext
}: BirthDateStepProps) {
  const [isValid, setIsValid] = useState(false);
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    if (formData.birthDate) {
      const date = new Date(formData.birthDate);
      const formatted = date.toISOString().split('T')[0];
      setDateString(formatted);
    }
  }, []);

  useEffect(() => {
    setIsValid(formData.birthDate !== null);
  }, [formData.birthDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateString(value);
    
    if (value) {
      const date = new Date(value);
      updateData('birthDate', date);
    } else {
      updateData('birthDate', null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">วันเดือนปีเกิด</CardTitle>
        <CardDescription>
          กรุณากรอกวันเดือนปีเกิดของคุณเพื่อช่วยเราประเมินความเหมาะสมในการฉีดวัคซีน
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">วันเดือนปีเกิด</Label>
          <Input
            id="birthDate"
            type="date"
            value={dateString}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="text-center"
          />
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
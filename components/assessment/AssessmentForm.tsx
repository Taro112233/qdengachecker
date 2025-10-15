// components/assessment/AssessmentForm.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@/public/logo.png";
import { Progress } from "@/components/ui/progress";
import { BasicInformationStep } from "./BasicInformationStep";
import { MedicalConditionsStep } from "./MedicalConditionsStep";
import { FormData, FormDataValue } from "@/types/assessment";

export function AssessmentForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [formData, setFormData] = useState<FormData>({
    age: null,
    gender: null,
    priorExposure: null,
    conditions: []
  });

  const updateFormData = (field: string, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleComplete = () => {
    // Store form data in sessionStorage for result page
    sessionStorage.setItem('assessmentData', JSON.stringify(formData));
    router.push('/assessment/result');
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-6 space-y-4">
        <Image src={Logo} alt="Takeda logo" height={50} />
        <h1 className="text-xl sm:text-2xl font-bold text-center px-2">
          แบบประเมินความเหมาะสมในการฉีดวัคซีนป้องกัน<br/>
          <span className="text-primary">โรคไข้เลือดออก</span>
        </h1>
      </div>

      <div className="max-w-md mx-auto mb-8 px-2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="w-full">
        {currentStep === 1 && (
          <BasicInformationStep
            formData={formData}
            updateData={updateFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <MedicalConditionsStep
            formData={formData}
            updateData={updateFormData}
            onNext={handleComplete}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </div>
    </div>
  );
}
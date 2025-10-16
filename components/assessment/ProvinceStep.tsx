// components/assessment/ProvinceStep.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormData, FormDataValue } from "@/types/assessment";
import { provinces } from "@/constants/provinces";
import { getDetailedRecommendation } from "@/utils/eligibility";

type ProvinceStepProps = {
  formData: FormData;
  updateData: (field: string, value: FormDataValue) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ProvinceStep({
  formData,
  updateData,
  onNext,
  onBack
}: ProvinceStepProps) {
  const [open, setOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsValid(formData.province !== null && formData.province !== "");
  }, [formData.province]);

  const sortedProvinces = useMemo(() => {
    return [...provinces].sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, []);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const detailedRec = getDetailedRecommendation(formData);
      
      const response = await fetch('/api/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recommendation: detailedRec.overall.vaccine,
          reason: detailedRec.overall.reason,
          ageRecommendation: detailedRec.age.recommendation,
          ageReason: detailedRec.age.reason,
          provinceRecommendation: detailedRec.location.recommendation
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
        <CardTitle className="font-bold">จังหวัดที่อาศัย</CardTitle>
        <CardDescription>
          กรุณาเลือกจังหวัดที่คุณอาศัยอยู่
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {formData.province
                  ? sortedProvinces.find((province) => province.name === formData.province)?.name
                  : "เลือกจังหวัด..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="ค้นหาจังหวัด..." />
                <CommandEmpty>ไม่พบจังหวัด</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {sortedProvinces.map((province) => (
                    <CommandItem
                      key={province.name}
                      value={province.name}
                      onSelect={(currentValue) => {
                        updateData('province', currentValue === formData.province ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.province === province.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {province.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "กำลังประมวลผล..." : "ตรวจสอบ"}
        </Button>
      </CardFooter>
    </Card>
  );
}
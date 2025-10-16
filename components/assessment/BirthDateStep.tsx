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
import { Button } from "@/components/ui/button";
import { FormData, FormDataValue } from "@/types/assessment";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DropdownNavProps, DropdownProps } from "react-day-picker";

type BirthDateStepProps = {
  formData: FormData;
  updateData: (field: string, value: FormDataValue) => void;
  onNext: () => void;
};

// Helper function to convert Gregorian year to Buddhist year
function toBuddhistYear(date: Date): string {
  const buddhistYear = date.getFullYear() + 543;
  return format(date, "d MMMM", { locale: th }) + " " + buddhistYear;
}

export function BirthDateStep({
  formData,
  updateData,
  onNext
}: BirthDateStepProps) {
  const [isValid, setIsValid] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    formData.birthDate ? new Date(formData.birthDate) : undefined
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setIsValid(formData.birthDate !== null);
  }, [formData.birthDate]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateData('birthDate', selectedDate);
    } else {
      updateData('birthDate', null);
    }
    setOpen(false);
  };

  const handleCalendarChange = (
    value: string | number,
    onChange: React.ChangeEventHandler<HTMLSelectElement>
  ) => {
    const event = {
      target: {
        value: String(value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-bold">วันเดือนปีเกิด</CardTitle>
        <CardDescription>
          กรุณาเลือกวันเดือนปีเกิดของคุณเพื่อช่วยเราประเมินความเหมาะสมในการฉีดวัคซีน
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="birthDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? toBuddhistYear(date) : "เลือกวันเกิด"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                captionLayout="dropdown"
                defaultMonth={date || new Date(2000, 0)}
                startMonth={new Date(1900, 0)}
                endMonth={new Date()}
                hideNavigation
                locale={th}
                classNames={{
                  month_caption: "mx-0 flex justify-center items-center pt-4 pb-2",
                  months: "relative",
                }}
                components={{
                  DropdownNav: (props: DropdownNavProps) => {
                    return (
                      <div className="flex w-full items-center gap-2 px-4">
                        {props.children}
                      </div>
                    );
                  },
                  Dropdown: (props: DropdownProps) => {
                    // If this is the year dropdown, show Buddhist years
                    const isYearDropdown = props.options && props.options.length > 50;
                    
                    let displayValue = String(props.value);
                    if (isYearDropdown && props.value) {
                      const buddhistYear = Number(props.value) + 543;
                      displayValue = buddhistYear.toString();
                    }

                    return (
                      <Select
                        value={String(props.value)}
                        onValueChange={(value) => {
                          if (props.onChange) {
                            handleCalendarChange(value, props.onChange);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 w-fit font-medium first:grow">
                          <SelectValue>
                            {isYearDropdown ? displayValue : props.options?.find(o => o.value === props.value)?.label}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                          {props.options?.map((option) => {
                            let displayLabel = option.label;
                            if (isYearDropdown) {
                              const buddhistYear = Number(option.value) + 543;
                              displayLabel = buddhistYear.toString();
                            }
                            
                            return (
                              <SelectItem
                                key={option.value}
                                value={String(option.value)}
                                disabled={option.disabled}
                              >
                                {displayLabel}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    );
                  },
                }}
              />
            </PopoverContent>
          </Popover>
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
// app/assessment/result/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { ResultDisplay } from "@/components/assessment/ResultDisplay";
import { FormData } from "@/types/assessment";

export default function ResultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // Get data from sessionStorage or redirect if not available
    const storedData = sessionStorage.getItem('assessmentData');
    
    if (!storedData) {
      router.push('/assessment');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setFormData(data);
    } catch (error) {
      console.error('Error parsing assessment data:', error);
      router.push('/assessment');
    }
  }, [router]);

  if (!formData) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-10">
      <div className="px-4 sm:px-6 md:px-8 max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6 space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center px-2">
            แบบประเมินความเสี่ยงในการเป็น<br/>
            <span className="text-primary">ไข้เลือดออก</span>
          </h1>
        </div>

        <ResultDisplay formData={formData} />
      </div>
    </div>
  );
}
// app/admin/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AssessmentTable } from "@/components/admin/AssessmentTable";

interface Assessment {
  id: string;
  age: number;
  gender: string;
  priorExposure: boolean;
  conditions: string[];
  recommendation: string;
  reason: string;
  createdAt: string;
}

export default function AdminPage() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await fetchAssessments();
      } else {
        setError("รหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssessments = async () => {
    setIsFetchingData(true);
    try {
      const response = await fetch("/api/admin/assessments");
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Image src={Logo} alt="Logo" height={50} className="mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Admin Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessCode">กรุณาใส่รหัสเข้าถึง</Label>
                <Input
                  id="accessCode"
                  type="password"
                  placeholder="Access Code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !accessCode}
              >
                {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Image src={Logo} alt="Logo" height={50} className="mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold">
            ข้อมูลการประเมินทั้งหมด
          </h1>
          <p className="text-gray-600 mt-2">
            จำนวนทั้งหมด: {assessments.length} รายการ
          </p>
        </div>

        <div className="mb-4 flex justify-end">
          {/* Export all button removed - use table's export selected instead */}
        </div>

        {isFetchingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
          <AssessmentTable 
            assessments={assessments} 
            onRefresh={fetchAssessments}
          />
        )}

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setAccessCode("");
              setAssessments([]);
            }}
          >
            ออกจากระบบ
          </Button>
        </div>
      </div>
    </div>
  );
}
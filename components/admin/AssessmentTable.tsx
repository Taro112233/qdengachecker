// components/admin/AssessmentTable.tsx

"use client";

import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Download, 
  Trash2, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  X
} from "lucide-react";

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

type SortField = 'createdAt' | 'age' | 'gender' | 'recommendation';
type SortDirection = 'asc' | 'desc' | null;

interface AssessmentTableProps {
  assessments: Assessment[];
  onRefresh: () => Promise<void>;
}

export function AssessmentTable({ assessments, onRefresh }: AssessmentTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [ageMin, setAgeMin] = useState<string>("");
  const [ageMax, setAgeMax] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  // Toggle individual selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Toggle all selection (filtered results only)
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedAssessments.length && filteredAndSortedAssessments.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedAssessments.map(a => a.id)));
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField('createdAt');
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort assessments
  const filteredAndSortedAssessments = useMemo(() => {
    let filtered = [...assessments];

    // Date filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter(a => new Date(a.createdAt) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.createdAt) <= toDate);
    }

    // Age filter
    if (ageMin) {
      filtered = filtered.filter(a => a.age >= parseInt(ageMin));
    }
    if (ageMax) {
      filtered = filtered.filter(a => a.age <= parseInt(ageMax));
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter(a => a.gender === genderFilter);
    }

    // Sort
    if (sortDirection) {
      filtered.sort((a, b) => {
        let aVal: string | number = a[sortField];
        let bVal: string | number = b[sortField];

        if (sortField === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [assessments, sortField, sortDirection, dateFrom, dateTo, ageMin, ageMax, genderFilter]);

  // Clear all filters
  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setAgeMin("");
    setAgeMax("");
    setGenderFilter("all");
  };

  const hasActiveFilters = dateFrom || dateTo || ageMin || ageMax || genderFilter !== "all";

  // Export selected to Excel
  const handleExportSelected = () => {
    const selectedAssessments = assessments.filter(a => selectedIds.has(a.id));
    
    if (selectedAssessments.length === 0) {
      alert("กรุณาเลือกรายการที่ต้องการ Export");
      return;
    }

    const exportData = selectedAssessments.map((assessment, index) => ({
      "ลำดับ": index + 1,
      "วันที่": new Date(assessment.createdAt).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      "อายุ": assessment.age,
      "เพศ": assessment.gender,
      "คนใกล้ชิดเคยเป็น": assessment.priorExposure ? "ใช่" : "ไม่ใช่",
      "โรคประจำตัว": assessment.conditions.length > 0 
        ? assessment.conditions.join(", ") 
        : "-",
      "คำแนะนำ": assessment.recommendation,
      "เหตุผล": assessment.reason
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Assessments");

    const fileName = `selected_assessments_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Delete selected records
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/admin/assessments/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });

      if (response.ok) {
        setSelectedIds(new Set());
        setDeleteDialogOpen(false);
        await onRefresh();
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting assessments:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <>
      {/* Filter and Action Buttons Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
          {/* Filters */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 w-full">
            {/* Date From */}
            <div className="space-y-1">
              <Label htmlFor="dateFrom" className="text-xs">วันที่เริ่มต้น</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <Label htmlFor="dateTo" className="text-xs">วันที่สิ้นสุด</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Age Min */}
            <div className="space-y-1">
              <Label htmlFor="ageMin" className="text-xs">อายุต่ำสุด</Label>
              <Input
                id="ageMin"
                type="number"
                placeholder="เช่น 18"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value)}
                min={0}
                className="h-9"
              />
            </div>

            {/* Age Max */}
            <div className="space-y-1">
              <Label htmlFor="ageMax" className="text-xs">อายุสูงสุด</Label>
              <Input
                id="ageMax"
                type="number"
                placeholder="เช่น 65"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value)}
                min={0}
                className="h-9"
              />
            </div>

            {/* Gender Filter */}
            <div className="space-y-1">
              <Label htmlFor="gender" className="text-xs">เพศ</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger id="gender" className="h-9">
                  <SelectValue placeholder="ทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="ชาย">ชาย</SelectItem>
                  <SelectItem value="หญิง">หญิง</SelectItem>
                  <SelectItem value="ไม่ระบุ">ไม่ระบุ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
              >
                <X className="h-4 w-4 mr-1" />
                ล้าง
              </Button>
            )}
            <Button
              onClick={handleExportSelected}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 h-9 whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Export ({selectedIds.size})
            </Button>
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              disabled={selectedIds.size === 0}
              variant="destructive"
              className="flex items-center gap-2 h-9 whitespace-nowrap text-white"
            >
              <Trash2 className="h-4 w-4 text-white" />
              ลบ ({selectedIds.size})
            </Button>
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 border-t pt-3">
          <div>
            แสดง <span className="font-semibold text-gray-900">{filteredAndSortedAssessments.length}</span> จาก <span className="font-semibold text-gray-900">{assessments.length}</span> รายการ
          </div>
          {selectedIds.size > 0 && (
            <Badge variant="secondary" className="text-sm">
              เลือกแล้ว {selectedIds.size} รายการ
            </Badge>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === filteredAndSortedAssessments.length && filteredAndSortedAssessments.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="min-w-[120px] cursor-pointer select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center">
                    วันที่
                    {getSortIcon('createdAt')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('age')}
                >
                  <div className="flex items-center">
                    อายุ
                    {getSortIcon('age')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('gender')}
                >
                  <div className="flex items-center">
                    เพศ
                    {getSortIcon('gender')}
                  </div>
                </TableHead>
                <TableHead>คนใกล้ชิดเคยเป็น</TableHead>
                <TableHead className="min-w-[200px]">โรคประจำตัว</TableHead>
                <TableHead 
                  className="min-w-[200px] cursor-pointer select-none"
                  onClick={() => handleSort('recommendation')}
                >
                  <div className="flex items-center">
                    คำแนะนำ
                    {getSortIcon('recommendation')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {hasActiveFilters ? "ไม่พบข้อมูลที่ตรงกับตัวกรอง" : "ยังไม่มีข้อมูลการประเมิน"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedAssessments.map((assessment) => (
                  <TableRow 
                    key={assessment.id}
                    className={`cursor-pointer transition-colors ${
                      selectedIds.has(assessment.id) 
                        ? 'bg-blue-50 hover:bg-blue-100' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleSelection(assessment.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(assessment.id)}
                        onCheckedChange={() => {
                          // Handled by row click
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(assessment.createdAt).toLocaleString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{assessment.age} ปี</TableCell>
                    <TableCell>{assessment.gender}</TableCell>
                    <TableCell>
                      {assessment.priorExposure ? (
                        <Badge variant="secondary">ใช่</Badge>
                      ) : (
                        <Badge variant="outline">ไม่ใช่</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {assessment.conditions.length > 0 ? (
                          assessment.conditions.map((condition, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          className={
                            assessment.recommendation.includes("ไม่แนะนำให้ฉีดวัคซีน")
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        >
                          {assessment.recommendation}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">
                          {assessment.reason}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบข้อมูล {selectedIds.size} รายการที่เลือก? 
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "กำลังลบ..." : "ลบข้อมูล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
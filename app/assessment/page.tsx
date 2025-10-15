// app/assessment/page.tsx

import { AssessmentForm } from "@/components/assessment/AssessmentForm";

export default function AssessmentPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center py-10">
      <AssessmentForm />
    </div>
  );
}
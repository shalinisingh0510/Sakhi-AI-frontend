import { ShieldCheck } from "lucide-react";

export function MedicalReviewBadge({ status, className = "" }: { status?: string, className?: string }) {
  if (status !== "MEDICALLY_REVIEWED") return null;
  return (
    <div className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ${className}`}>
      <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
      <span>Medically Reviewed</span>
    </div>
  );
}

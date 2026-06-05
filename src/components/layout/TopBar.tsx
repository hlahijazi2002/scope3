import { CloudCheck } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";

// CONSTANTS

const STEP_TITLES: Record<number, string> = {
  1: "Operational Screening & Boundary",
  2: "Scope 3 Categories",
  3: "Data Collection",
  4: "Data Availability",
  5: "Review & Submit",
};

// HELPERS

function formatSaved(iso: string | null): string {
  if (!iso) return "Not saved yet";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "Saved just now";
  if (diff < 60) return `Saved ${diff}s ago`;
  if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
  return "Saved";
}

// COMPONENT

export default function TopBar() {
  const { currentStep, progressPercent } = useNavigation();
  const { state } = useAssessment();
  const TOTAL_STEPS = 5;

  return (
    <header className="relative bg-white border-b border-[#E5E7EB] px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between z-50 shadow-sm shrink-0">
      {/* ── Logo ── */}
      <img className="w-[120px]" src="/logo.png" alt="" />
      {/* ── Step info ── */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] sm:text-[11px] text-[#6B7280] font-medium">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <span className="text-[12px] sm:text-[13px] font-semibold text-[#1D1F21] hidden xs:block">
          {STEP_TITLES[currentStep] ?? "Assessment"}
        </span>
      </div>

      {/* ── Save indicator ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <CloudCheck size={13} className="text-[#1FA971]" />
        <span className="text-[11px] sm:text-[12px] text-[#1FA971] font-medium hidden sm:block">
          {formatSaved(state.lastSaved)}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#E5E7EB]">
        <div
          className="h-full bg-[#1FA971] transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}

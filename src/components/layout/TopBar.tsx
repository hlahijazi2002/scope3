import { Leaf, CloudCheck } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

const STEP_TITLES: Record<number, string> = {
  1: "Company Profile",
  2: "Operational Screening",
  3: "Scope 3 Categories",
  4: "Data Collection",
  5: "Data Availability",
  6: "Review & Submit",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatSaved(iso: string | null): string {
  if (!iso) return "Not saved yet";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "Saved just now";
  if (diff < 60) return `Saved ${diff}s ago`;
  if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
  return "Saved";
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function TopBar() {
  const { currentStep, progressPercent } = useNavigation();
  const { state } = useAssessment();

  const TOTAL_STEPS = 6;

  return (
    <header className="relative bg-white border-b border-[#E5E7EB] px-6 h-15 flex items-center justify-between z-50 shadow-sm shrink-0">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2">
        <div className="w-7.5 h-7.5 rounded-[7px] bg-[#0F5F4B] flex items-center justify-center">
          <Leaf size={15} className="text-white" />
        </div>
        <span className="font-bold text-[15px] text-[#1D1F21] tracking-wide">
          URIMPACT
        </span>
      </div>

      {/* ── Step info ── */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] text-[#6B7280] font-medium">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <span className="text-[13px] font-semibold text-[#1D1F21]">
          {STEP_TITLES[currentStep] ?? "Assessment"}
        </span>
      </div>

      {/* ── Save indicator ── */}
      <div className="flex items-center gap-1.5">
        <CloudCheck size={14} className="text-[#1FA971]" />
        <span className="text-[12px] text-[#1FA971] font-medium">
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

import { Check } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { ApplicabilityStatus } from "@/types/assessment.types";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";

// CONSTANTS

const STEPS = [
  { id: 1, title: "Company Profile", sub: "Org & boundary" },
  { id: 2, title: "Operational Screening", sub: "Business activities" },
  { id: 3, title: "Scope 3 Categories", sub: "Applicability review" },
  { id: 4, title: "Data Collection", sub: "Detailed input" },
  { id: 5, title: "Data Availability", sub: "Readiness check" },
  { id: 6, title: "Review & Submit", sub: "Final confirmation" },
];

// CATEGORY STATUS DOT

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    [ApplicabilityStatus.APPLICABLE]: "bg-[#1FA971]",
    [ApplicabilityStatus.NOT_APPLICABLE]: "bg-[#6B7280] opacity-40",
    [ApplicabilityStatus.POTENTIAL]: "bg-amber-400",
    [ApplicabilityStatus.PENDING]: "bg-[#E5E7EB]",
  };
  return (
    <span
      className={`w-2 h-2 rounded-full shrink-0 ${colors[status] ?? "bg-[#E5E7EB]"}`}
    />
  );
}

// COMPONENT

export default function Sidebar() {
  const { currentStep, goToStep, isStepCompleted } = useNavigation();
  const { state } = useAssessment();

  return (
    <aside className="w-65 shrink-0 bg-white border-r border-[#E5E7EB] overflow-y-auto py-5 px-3">
      {/* ── Assessment Steps ── */}
      <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3 px-2">
        Assessment Steps
      </div>

      <nav className="space-y-0.5 mb-4">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = isStepCompleted(step.id);

          return (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`
                w-full flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-left
                transition-all duration-200
                ${isActive ? "bg-[#F3FBF7]" : "hover:bg-[#F9FAFB]"}
              `}
            >
              {/* step number / check */}
              <div
                className={`
                w-6.5 h-6.5 rounded-full shrink-0 flex items-center justify-center
                text-[11px] font-semibold border-[1.5px] transition-colors
                ${
                  isActive
                    ? "bg-[#0F5F4B] border-[#0F5F4B] text-white"
                    : isCompleted
                      ? "bg-[#1FA971] border-[#1FA971] text-white"
                      : "bg-white border-[#E5E7EB] text-[#6B7280]"
                }
              `}
              >
                {isCompleted && !isActive ? <Check size={12} /> : step.id}
              </div>

              {/* labels */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[12px] font-semibold truncate ${isActive ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-[#6B7280]">{step.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="h-px bg-[#E5E7EB] mx-2 mb-4" />

      {/* ── Category Status ── */}
      <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3 px-2">
        Category Status
      </div>

      <div className="space-y-0.5">
        {SCOPE3_CATEGORIES.map((cat) => {
          const response = state.categoryResponses[cat.id];
          return (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#6B7280]"
            >
              <StatusDot
                status={response?.applicability ?? ApplicabilityStatus.PENDING}
              />
              <span className="truncate">{cat.name}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

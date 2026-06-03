import { useState } from "react";
import { Check, X, LayoutList } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { ApplicabilityStatus } from "@/types/assessment.types";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: "Operational Screening", sub: "Boundary & activities" },
  { id: 2, title: "Scope 3 Categories",    sub: "Applicability review"  },
  { id: 3, title: "Data Collection",       sub: "Detailed input"        },
  { id: 4, title: "Data Availability",     sub: "Readiness check"       },
  { id: 5, title: "Review & Submit",       sub: "Final confirmation"    },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS DOT
// ─────────────────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    [ApplicabilityStatus.APPLICABLE]:     "bg-[#1FA971]",
    [ApplicabilityStatus.NOT_APPLICABLE]: "bg-[#6B7280] opacity-40",
    [ApplicabilityStatus.POTENTIAL]:      "bg-amber-400",
    [ApplicabilityStatus.PENDING]:        "bg-[#E5E7EB]",
  };
  return <span className={`w-2 h-2 rounded-full shrink-0 ${colors[status] ?? "bg-[#E5E7EB]"}`} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR CONTENT
// ─────────────────────────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { currentStep, goToStep, isStepCompleted } = useNavigation();
  const { state }                                   = useAssessment();

  const handleStep = (id: number) => {
    goToStep(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full py-5 px-3 overflow-y-auto">

      {/* ── mobile close button ── */}
      {onClose && (
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="text-[13px] font-bold text-[#1D1F21]">Navigation</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          >
            <X size={14} className="text-[#6B7280]" />
          </button>
        </div>
      )}

      {/* ── Assessment Steps ── */}
      <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3 px-2">
        Assessment Steps
      </div>

      <nav className="space-y-0.5 mb-4">
        {STEPS.map((step) => {
          const isActive    = currentStep === step.id;
          const isCompleted = isStepCompleted(step.id);
          return (
            <button
              key={step.id}
              onClick={() => handleStep(step.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-left transition-all duration-200 ${isActive ? "bg-[#F3FBF7]" : "hover:bg-[#F9FAFB]"}`}
            >
              <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-semibold border-[1.5px] transition-colors ${isActive ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : isCompleted ? "bg-[#1FA971] border-[#1FA971] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280]"}`}>
                {isCompleted && !isActive ? <Check size={12} /> : step.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[12px] font-semibold truncate ${isActive ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}>{step.title}</div>
                <div className="text-[11px] text-[#6B7280]">{step.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="h-px bg-[#E5E7EB] mx-2 mb-4" />

      {/* ── Category Status ── */}
      <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3 px-2">
        Category Status
      </div>

      <div className="space-y-0.5">
        {SCOPE3_CATEGORIES.map((cat) => {
          const response = state.categoryResponses[cat.id];
          return (
            <div key={cat.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-[#6B7280]">
              <StatusDot status={response?.applicability ?? ApplicabilityStatus.PENDING} />
              <span className="truncate">{cat.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Mobile toggle button — fixed bottom left ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 lg:hidden w-12 h-12 rounded-full bg-[#0F5F4B] text-white shadow-lg flex items-center justify-center hover:bg-[#0a4a39] transition-colors"
      >
        <LayoutList size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`
        fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-2xl
        transition-transform duration-300 lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <SidebarContent onClose={() => setIsOpen(false)} />
      </div>

      {/* ── Desktop sidebar — always visible ── */}
      <aside className="hidden lg:flex w-64 shrink-0 h-full bg-white border-r border-[#E5E7EB] flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
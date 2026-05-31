import { Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface MicroStep {
  id: number;
  label: string;
}

interface MicroStepperProps {
  steps: MicroStep[];
  current: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MicroStepper({ steps, current }: MicroStepperProps) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {steps.map((step, index) => {
        const isDone = current > step.id;
        const isActive = current === step.id;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex items-center">
            {/* dot */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-7 h-7 rounded-full flex items-center justify-center
                  text-[11px] font-semibold border-2 transition-all duration-300
                  ${
                    isDone
                      ? "bg-[#1FA971] border-[#1FA971] text-white"
                      : isActive
                        ? "bg-white border-[#0F5F4B] text-[#0F5F4B]"
                        : "bg-white border-[#E5E7EB] text-[#9CA3AF]"
                  }
                `}
              >
                {isDone ? <Check size={12} /> : step.id}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${isActive ? "text-[#0F5F4B]" : "text-[#9CA3AF]"}`}
              >
                {step.label}
              </span>
            </div>

            {/* line */}
            {!isLast && (
              <div
                className={`w-10 h-0.5 mx-1 mb-4 rounded-full transition-all duration-300 ${isDone ? "bg-[#1FA971]" : "bg-[#E5E7EB]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

import {
  LayoutGrid,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import { ApplicabilityStatus } from "@/types/assessment.types";
import type { Scope3CategoryDefinition } from "@/types/assessment.types";
import MicroStepper from "../ui/MicroStepper";

// EFFORT MAP

const EFFORT: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "High Effort", color: "text-red-600", bg: "bg-red-50" },
  2: { label: "Medium Effort", color: "text-amber-600", bg: "bg-amber-50" },
  3: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  4: { label: "Medium Effort", color: "text-amber-600", bg: "bg-amber-50" },
  5: { label: "Medium Effort", color: "text-amber-600", bg: "bg-amber-50" },
  6: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  7: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  8: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  9: { label: "Medium Effort", color: "text-amber-600", bg: "bg-amber-50" },
  10: { label: "High Effort", color: "text-red-600", bg: "bg-red-50" },
  11: { label: "High Effort", color: "text-red-600", bg: "bg-red-50" },
  12: { label: "Medium Effort", color: "text-amber-600", bg: "bg-amber-50" },
  13: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  14: { label: "Low Effort", color: "text-blue-600", bg: "bg-blue-50" },
  15: { label: "High Effort", color: "text-red-600", bg: "bg-red-50" },
};

// STATUS CONFIG

const STATUS_CONFIG = {
  [ApplicabilityStatus.APPLICABLE]: {
    label: "Applicable",
    icon: <CheckCircle2 size={12} />,
    color: "text-[#1FA971]",
    bg: "bg-[#F3FBF7]",
    border: "border-[#1FA971]/30",
  },
  [ApplicabilityStatus.POTENTIAL]: {
    label: "Potential",
    icon: <Clock size={12} />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  [ApplicabilityStatus.NOT_APPLICABLE]: {
    label: "Not Applicable",
    icon: <Ban size={12} />,
    color: "text-[#9CA3AF]",
    bg: "bg-[#F3F4F6]",
    border: "border-[#E5E7EB]",
  },
  [ApplicabilityStatus.PENDING]: {
    label: "Pending",
    icon: <Clock size={12} />,
    color: "text-[#9CA3AF]",
    bg: "bg-[#F9FAFB]",
    border: "border-[#E5E7EB]",
  },
};

// CATEGORY CARD
function CategoryCard({
  cat,
  applicability,
  onToggle,
  onMarkNA,
}: {
  cat: Scope3CategoryDefinition;
  applicability: string;
  onToggle: () => void;
  onMarkNA: () => void;
}) {
  const effort = EFFORT[cat.id];
  const status =
    STATUS_CONFIG[applicability as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG[ApplicabilityStatus.PENDING];
  const isNA = applicability === ApplicabilityStatus.NOT_APPLICABLE;
  const isApp = applicability === ApplicabilityStatus.APPLICABLE;

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-2 p-5 transition-all duration-200
        ${
          isNA
            ? "border-[#E5E7EB] opacity-60"
            : isApp
              ? "border-[#1FA971]/40 shadow-sm"
              : "border-[#E5E7EB] hover:border-[#1FA971]/30 hover:shadow-sm"
        }
      `}
    >
      {/* ─ top row ─ */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* category number */}
          <span className="w-7 h-7 rounded-xl bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold flex items-center justify-center shrink-0">
            {cat.id}
          </span>
          {/* ghg code */}
          <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            {cat.ghgCode}
          </span>
        </div>

        {/* effort badge */}
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${effort.color} ${effort.bg}`}
        >
          {effort.label}
        </span>
      </div>

      {/* ─ name ─ */}
      <h3
        className={`text-[13px] font-bold mb-2 leading-snug ${isNA ? "text-[#9CA3AF]" : "text-[#1D1F21]"}`}
      >
        {cat.name}
      </h3>

      {/* ─ description ─ */}
      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
        {cat.description}
      </p>

      {/* ─ status badge ─ */}
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold mb-4 ${status.color} ${status.bg} ${status.border}`}
      >
        {status.icon}
        {status.label}
      </div>

      {/* ─ actions ─ */}
      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`
            flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200
            ${
              isApp
                ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39]"
                : isNA
                  ? "bg-[#F3FBF7] text-[#0F5F4B] border border-[#1FA971]/30 hover:bg-[#E8F7F0]"
                  : "bg-[#F3FBF7] text-[#0F5F4B] border border-[#1FA971]/30 hover:bg-[#E8F7F0]"
            }
          `}
        >
          {isApp ? "✓ Applicable" : isNA ? "Re-enable" : "Mark Applicable"}
        </button>

        {!isNA && (
          <button
            onClick={onMarkNA}
            className="px-3 py-2 rounded-xl text-[12px] font-medium text-[#9CA3AF] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#6B7280] transition-colors"
            title="Mark as Not Applicable"
          >
            <Ban size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// COMPONENT

export default function Step2_Scope3Categories() {
  const { goNext, goBack } = useNavigation();
  const { state, dispatch } = useAssessment();

  const responses = state.categoryResponses;

  const counts = {
    applicable: Object.values(responses).filter(
      (r) => r.applicability === ApplicabilityStatus.APPLICABLE,
    ).length,
    potential: Object.values(responses).filter(
      (r) => r.applicability === ApplicabilityStatus.POTENTIAL,
    ).length,
    notApplicable: Object.values(responses).filter(
      (r) => r.applicability === ApplicabilityStatus.NOT_APPLICABLE,
    ).length,
  };

  const canProceed = counts.applicable > 0;

  // ─ handlers ─

  const toggleApplicable = (id: number) => {
    const current = responses[id]?.applicability;
    const next =
      current === ApplicabilityStatus.APPLICABLE
        ? ApplicabilityStatus.POTENTIAL
        : ApplicabilityStatus.APPLICABLE;
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: { categoryId: id, data: { applicability: next } },
    });
  };

  const markNA = (id: number) => {
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: {
        categoryId: id,
        data: { applicability: ApplicabilityStatus.NOT_APPLICABLE },
      },
    });
  };

  const resetAll = () => {
    SCOPE3_CATEGORIES.forEach((c) =>
      dispatch({
        type: "SET_CATEGORY_RESPONSE",
        payload: {
          categoryId: c.id,
          data: { applicability: ApplicabilityStatus.PENDING },
        },
      }),
    );
  };

  // ─ split upstream / downstream ─
  const upstream = SCOPE3_CATEGORIES.filter((c) => c.isUpstream);
  const downstream = SCOPE3_CATEGORIES.filter((c) => !c.isUpstream);

  return (
    <div className="w-full min-w-0">
      {/* ─ Header ─ */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center  shrink-0">
          <LayoutGrid size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 2 of 5
          </div>
          <h2 className="text-[22px] font-bold text-[#1D1F21] leading-tight">
            Scope 3 Categories
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Review and confirm which categories apply to your organization.
            Pre-filled based on your screening answers.
          </p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors  shrink-0"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Upstream" },
          { id: 2, label: "Downstream" },
        ]}
        current={counts.applicable > 0 ? 2 : 1}
      />
      {/* ─ Summary strip ─ */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          {
            label: "Applicable",
            count: counts.applicable,
            color: "text-[#1FA971]",
            bg: "bg-[#F3FBF7]",
            border: "border-[#1FA971]/20",
          },
          {
            label: "Potential",
            count: counts.potential,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
          },
          {
            label: "Not Applicable",
            count: counts.notApplicable,
            color: "text-[#9CA3AF]",
            bg: "bg-[#F3F4F6]",
            border: "border-[#E5E7EB]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3 flex items-center justify-between`}
          >
            <span className="text-[12px] font-medium text-[#6B7280]">
              {s.label}
            </span>
            <span className={`text-[22px] font-bold ${s.color}`}>
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* ─ Upstream ─ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
            Upstream
          </span>
          <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
            Cat 1–8
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {upstream.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              applicability={
                responses[cat.id]?.applicability ?? ApplicabilityStatus.PENDING
              }
              onToggle={() => toggleApplicable(cat.id)}
              onMarkNA={() => markNA(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* ─ Downstream ─ */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
            Downstream
          </span>
          <span className="text-[10px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
            Cat 9–15
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {downstream.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              applicability={
                responses[cat.id]?.applicability ?? ApplicabilityStatus.PENDING
              }
              onToggle={() => toggleApplicable(cat.id)}
              onMarkNA={() => markNA(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* ─ Nav ─ */}
      <div className="flex items-center justify-between pb-10">
        <button
          onClick={goBack}
          className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:text-[#1D1F21] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all duration-200"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          {!canProceed && (
            <span className="text-[12px] text-[#9CA3AF]">
              Mark at least one category as applicable
            </span>
          )}
          <button
            onClick={goNext}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold
              transition-all duration-200
              ${
                canProceed
                  ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              }
            `}
          >
            Next: Data Collection
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

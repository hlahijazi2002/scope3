import { ClipboardCheck, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import {
  ApplicabilityStatus,
  DataAvailabilityStatus,
} from "@/types/assessment.types";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import MicroStepper from "../ui/MicroStepper";

// DATA

const AVAILABILITY_OPTIONS = [
  {
    value: DataAvailabilityStatus.AVAILABLE,
    label: "Available",
    desc: "Data is ready and accessible",
    color: "text-[#1FA971]",
    bg: "bg-[#F3FBF7]",
    border: "border-[#1FA971]/40",
    dot: "bg-[#1FA971]",
  },
  {
    value: DataAvailabilityStatus.PARTIALLY_AVAILABLE,
    label: "Partial",
    desc: "Some data available, gaps exist",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  {
    value: DataAvailabilityStatus.NOT_AVAILABLE,
    label: "Not Available",
    desc: "No data at this time",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  {
    value: DataAvailabilityStatus.PLANNED,
    label: "Planned",
    desc: "Collection planned for future",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
];

// READINESS GAUGE

function ReadinessGauge({ percent }: { percent: number }) {
  const color =
    percent >= 70 ? "#1FA971" : percent >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${percent * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[20px] sm:text-[22px] font-bold text-[#1D1F21]">
            {percent}%
          </span>
          <span className="text-[10px] text-[#6B7280] font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
}

// CATEGORY ROW

function CategoryAvailabilityRow({
  catId,
  catName,
  catCode,
  availability,
  onChange,
}: {
  catId: number;
  catName: string;
  catCode: string;
  availability: string;
  onChange: (v: string) => void;
}) {
  const current = AVAILABILITY_OPTIONS.find((o) => o.value === availability);

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 shadow-sm">
      {/* top */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-xl bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold flex items-center justify-center shrink-0">
          {catId}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#1D1F21] truncate">
            {catName}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">{catCode}</div>
        </div>
        {current && (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${current.color} ${current.bg} ${current.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
            {current.label}
          </span>
        )}
      </div>

      {/* options — 2 cols on mobile, 4 cols on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {AVAILABILITY_OPTIONS.map((opt) => {
          const isSelected = availability === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`
                p-2.5 rounded-xl border-2 text-center transition-all duration-200
                ${
                  isSelected
                    ? `${opt.border} ${opt.bg}`
                    : "border-[#E5E7EB] bg-white hover:border-[#1FA971]/30 hover:bg-[#F9FAFB]"
                }
              `}
            >
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1.5 ${isSelected ? opt.dot : "bg-[#E5E7EB]"}`}
              />
              <div
                className={`text-[10px] font-semibold ${isSelected ? opt.color : "text-[#9CA3AF]"}`}
              >
                {opt.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// COMPONENT

export default function Step5_DataAvailability() {
  const { goNext, goBack } = useNavigation();
  const { state, dispatch } = useAssessment();

  const applicable = SCOPE3_CATEGORIES.filter(
    (c) =>
      state.categoryResponses[c.id]?.applicability ===
      ApplicabilityStatus.APPLICABLE,
  );

  const setAvailability = (catId: number, value: string) => {
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: {
        categoryId: catId,
        data: { dataAvailability: value as DataAvailabilityStatus },
      },
    });
  };

  const readyCount = applicable.filter((c) => {
    const a = state.categoryResponses[c.id]?.dataAvailability;
    return (
      a === DataAvailabilityStatus.AVAILABLE ||
      a === DataAvailabilityStatus.PARTIALLY_AVAILABLE
    );
  }).length;

  const readinessPercent =
    applicable.length === 0
      ? 0
      : Math.round((readyCount / applicable.length) * 100);

  const counts = {
    available: applicable.filter(
      (c) =>
        state.categoryResponses[c.id]?.dataAvailability ===
        DataAvailabilityStatus.AVAILABLE,
    ).length,
    partial: applicable.filter(
      (c) =>
        state.categoryResponses[c.id]?.dataAvailability ===
        DataAvailabilityStatus.PARTIALLY_AVAILABLE,
    ).length,
    none: applicable.filter(
      (c) =>
        state.categoryResponses[c.id]?.dataAvailability ===
        DataAvailabilityStatus.NOT_AVAILABLE,
    ).length,
    planned: applicable.filter(
      (c) =>
        state.categoryResponses[c.id]?.dataAvailability ===
        DataAvailabilityStatus.PLANNED,
    ).length,
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <ClipboardCheck size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 5 of 6
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#1D1F21] leading-tight">
            Data Availability
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#6B7280] mt-1">
            Indicate how readily available data is for each applicable category.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Review" },
          { id: 2, label: "Readiness" },
        ]}
        current={readinessPercent > 0 ? 2 : 1}
      />

      {/* ── Readiness dashboard ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-6">
        {/* Stack on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <ReadinessGauge percent={readinessPercent} />
          <div className="flex-1 w-full">
            <h3 className="text-[15px] font-bold text-[#1D1F21] mb-1 text-center sm:text-left">
              Data Readiness Score
            </h3>
            <p className="text-[12px] text-[#6B7280] mb-4 text-center sm:text-left">
              {readinessPercent >= 70
                ? "Strong data foundation — ready for quantification."
                : readinessPercent >= 40
                  ? "Moderate readiness — consider improving key categories."
                  : "Limited data available — focus on high-priority categories first."}
            </p>
            {/* 2 cols on mobile, 4 cols on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                {
                  label: "Available",
                  count: counts.available,
                  color: "text-[#1FA971]",
                  bg: "bg-[#F3FBF7]",
                },
                {
                  label: "Partial",
                  count: counts.partial,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  label: "None",
                  count: counts.none,
                  color: "text-red-500",
                  bg: "bg-red-50",
                },
                {
                  label: "Planned",
                  count: counts.planned,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} rounded-xl p-3 text-center`}
                >
                  <div className={`text-[20px] font-bold ${s.color}`}>
                    {s.count}
                  </div>
                  <div className="text-[10px] text-[#6B7280] font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── warning ── */}
      {readinessPercent < 40 && applicable.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-700 leading-relaxed">
            Low data readiness may impact the accuracy of your Scope 3
            quantification. Consider engaging suppliers or enabling data
            collection processes for key categories.
          </p>
        </div>
      )}

      {/* ── category rows ── */}
      <div className="space-y-3 mb-8">
        {applicable.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
            <p className="text-[14px] font-semibold text-[#1D1F21] mb-1">
              No applicable categories
            </p>
            <p className="text-[13px] text-[#6B7280]">
              Go back to Step 3 to mark categories as applicable.
            </p>
          </div>
        ) : (
          applicable.map((cat) => (
            <CategoryAvailabilityRow
              key={cat.id}
              catId={cat.id}
              catName={cat.name}
              catCode={cat.ghgCode}
              availability={
                state.categoryResponses[cat.id]?.dataAvailability ??
                DataAvailabilityStatus.NOT_AVAILABLE
              }
              onChange={(v) => setAvailability(cat.id, v)}
            />
          ))
        )}
      </div>

      {/* ── Nav ── */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-10">
        <button
          onClick={goBack}
          className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:text-[#1D1F21] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all duration-200 text-center"
        >
          ← Back
        </button>
        <button
          onClick={goNext}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          Next: Review & Submit
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Ban,
  AlertTriangle,
  RotateCcw,
  Send,
} from "lucide-react";
import {
  useNavigation,
  useAssessment,
  useAssessmentSummary,
} from "@/hooks/useAssessment";
import {
  ApplicabilityStatus,
  DataAvailabilityStatus,
} from "@/types/assessment.types";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import MicroStepper from "../ui/MicroStepper";

// HEATMAP

function CategoryHeatmap() {
  const { state } = useAssessment();

  const getColor = (catId: number) => {
    const r = state.categoryResponses[catId];
    if (!r) return "bg-[#F3F4F6] text-[#9CA3AF]";
    if (r.applicability === ApplicabilityStatus.NOT_APPLICABLE)
      return "bg-[#F3F4F6] text-[#9CA3AF] opacity-50";
    if (r.applicability === ApplicabilityStatus.PENDING)
      return "bg-[#FEF9C3] text-amber-700";
    if (r.applicability === ApplicabilityStatus.POTENTIAL)
      return "bg-amber-100 text-amber-700";
    // applicable — shade by data availability
    const avail = r.dataAvailability;
    if (avail === DataAvailabilityStatus.AVAILABLE)
      return "bg-[#1FA971] text-white";
    if (avail === DataAvailabilityStatus.PARTIALLY_AVAILABLE)
      return "bg-[#6BCF9E] text-white";
    if (avail === DataAvailabilityStatus.PLANNED)
      return "bg-blue-400 text-white";
    return "bg-[#E5E7EB] text-[#6B7280]";
  };

  return (
    // 3 cols on mobile, 5 cols on sm+
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {SCOPE3_CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          className={`rounded-xl p-2 sm:p-3 text-center transition-all duration-300 ${getColor(cat.id)}`}
        >
          <div className="text-[11px] font-bold mb-0.5">{cat.id}</div>
          <div className="text-[9px] font-medium leading-tight line-clamp-2">
            {cat.name.split(" ").slice(0, 2).join(" ")}
          </div>
        </div>
      ))}
    </div>
  );
}

// SUMMARY ROW

function SummaryRow({ catId }: { catId: number }) {
  const { state } = useAssessment();
  const { goToStep } = useNavigation();
  const cat = SCOPE3_CATEGORIES.find((c) => c.id === catId);
  const response = state.categoryResponses[catId];
  if (!cat || !response) return null;

  const availLabel: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    [DataAvailabilityStatus.AVAILABLE]: {
      label: "Available",
      color: "text-[#1FA971]",
      bg: "bg-[#F3FBF7]",
    },
    [DataAvailabilityStatus.PARTIALLY_AVAILABLE]: {
      label: "Partial",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    [DataAvailabilityStatus.NOT_AVAILABLE]: {
      label: "Not Available",
      color: "text-red-500",
      bg: "bg-red-50",
    },
    [DataAvailabilityStatus.PLANNED]: {
      label: "Planned",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  };

  const avail = availLabel[response.dataAvailability];

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
      <span className="w-6 h-6 rounded-lg bg-[#F3F4F6] text-[#6B7280] text-[10px] font-bold flex items-center justify-center shrink-0">
        {cat.id}
      </span>
      <span className="flex-1 text-[12px] sm:text-[13px] font-semibold text-[#1D1F21] truncate">
        {cat.name}
      </span>
      <span className="text-[11px] text-[#9CA3AF] hidden sm:block">
        {cat.ghgCode}
      </span>
      {avail && (
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${avail.color} ${avail.bg}`}
        >
          {avail.label}
        </span>
      )}
      <button
        onClick={() => goToStep(3)}
        className="text-[11px] text-[#1FA971] font-medium hover:underline shrink-0"
      >
        Edit
      </button>
    </div>
  );
}

// COMPONENT

export default function Step6_ReviewSubmit() {
  const { goBack } = useNavigation();
  const { state } = useAssessment();
  const summary = useAssessmentSummary();

  const hasIssues = summary.pending.length > 0;

  const handleSubmit = () => {
    alert("Assessment submitted successfully! 🎉");
  };

  return (
    <div className="w-full min-w-0">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <FileCheck2 size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 5 of 5
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#1D1F21] leading-tight">
            Review & Submit
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#6B7280] mt-1">
            Review your complete Scope 3 applicability assessment before
            submitting.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Summary" },
          { id: 2, label: "Heatmap" },
          { id: 3, label: "Submit" },
        ]}
        current={summary.totalApplicable > 0 ? 3 : 1}
      />

      {/* ── Company summary card ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <h3 className="text-[14px] font-bold text-[#1D1F21] mb-4">
          Assessment Summary
        </h3>
        {/* 1 col mobile, 2 col sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: "Company", value: state.companyProfile.name || "—" },
            { label: "Industry", value: state.companyProfile.industry || "—" },
            { label: "Country", value: state.companyProfile.country || "—" },
            {
              label: "Reporting Year",
              value: state.companyProfile.reportingYear || "—",
            },
            {
              label: "Org Boundary",
              value: state.companyProfile.orgBoundary || "—",
            },
            {
              label: "Employees",
              value: state.companyProfile.employeeCount || "—",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-0.5">
                {item.label}
              </div>
              <div className="text-[13px] font-semibold text-[#1D1F21]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats strip — 2 cols mobile, 4 cols sm+ ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        {[
          {
            label: "Applicable",
            count: summary.totalApplicable,
            icon: <CheckCircle2 size={16} />,
            color: "text-[#1FA971]",
            bg: "bg-[#F3FBF7]",
            border: "border-[#1FA971]/20",
          },
          {
            label: "Potential",
            count: summary.potential.length,
            icon: <Clock size={16} />,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
          },
          {
            label: "Not Applicable",
            count: summary.notApplicable.length,
            icon: <Ban size={16} />,
            color: "text-[#9CA3AF]",
            bg: "bg-[#F3F4F6]",
            border: "border-[#E5E7EB]",
          },
          {
            label: "Data Ready",
            count: `${summary.readinessPercent}%`,
            icon: <FileCheck2 size={16} />,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-2xl p-3 sm:p-4`}
          >
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className={`text-[20px] sm:text-[22px] font-bold ${s.color}`}>
              {s.count}
            </div>
            <div className="text-[11px] text-[#6B7280] font-medium">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Heatmap ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h3 className="text-[14px] font-bold text-[#1D1F21]">
            Category Heatmap
          </h3>
          {/* Legend wraps on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] font-semibold text-[#6B7280]">
            {[
              { label: "Available", color: "bg-[#1FA971]" },
              { label: "Partial", color: "bg-[#6BCF9E]" },
              { label: "Potential", color: "bg-amber-100" },
              { label: "N/A", color: "bg-[#F3F4F6]" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1">
                <span className={`w-2.5 h-2.5 rounded ${l.color}`} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
        <CategoryHeatmap />
      </div>

      {/* ── Applicable categories list ── */}
      {summary.applicable.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm mb-4 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-[14px] font-bold text-[#1D1F21]">
              Applicable Categories ({summary.applicable.length})
            </h3>
          </div>
          {summary.applicable.map((r) => (
            <SummaryRow key={r.categoryId} catId={r.categoryId} />
          ))}
        </div>
      )}

      {/* ── warnings ── */}
      {hasIssues && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-700 mb-1">
              {summary.pending.length} categories still pending review
            </p>
            <p className="text-[12px] text-amber-600 leading-relaxed">
              Go back to Step 2 to confirm or dismiss these categories before
              submitting.
            </p>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-10">
        <button
          onClick={goBack}
          className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:text-[#1D1F21] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all duration-200 text-center"
        >
          ← Back
        </button>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-medium text-[#6B7280] hover:bg-white transition-colors"
          >
            <RotateCcw size={14} /> Start Over
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Send size={14} /> Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ScanSearch, ChevronRight, Sparkles, Info } from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { OrgBoundary, ApplicabilityStatus } from "@/types/assessment.types";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import MicroStepper from "@/components/ui/MicroStepper";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "hasSoldProducts",
    number: "01",
    title: "Does your company sell physical products?",
    desc: "Determines whether downstream product categories (Cat 9–12) apply.",
    tag: "Downstream",
  },
  {
    id: "hasBusinessTravel",
    number: "02",
    title: "Do employees travel for business purposes?",
    desc: "Flights, hotel stays, rail travel, rental vehicles.",
    tag: "Cat 6",
  },
  {
    id: "hasThirdPartyLogistics",
    number: "03",
    title: "Do you outsource logistics or use third-party freight?",
    desc: "3PL providers, freight carriers, courier services.",
    tag: "Cat 4 & 9",
  },
  {
    id: "hasManufacturing",
    number: "04",
    title: "Does your company have manufacturing or production operations?",
    desc: "Affects waste generation, energy use, and upstream emissions.",
    tag: "Cat 2 & 5",
  },
  {
    id: "hasLeasedAssets",
    number: "05",
    title: "Does your company lease assets it doesn't own?",
    desc: "Rented offices, leased vehicles, warehouses, data centers.",
    tag: "Cat 8 & 13",
  },
  {
    id: "hasInvestments",
    number: "06",
    title: "Does your company hold investments in other entities?",
    desc: "Equity investments, joint ventures, subsidiaries.",
    tag: "Cat 15",
  },
] as const;

type QuestionId = (typeof QUESTIONS)[number]["id"];
type ToggleAnswers = Record<QuestionId, boolean | null>;

const BOUNDARY_OPTIONS = [
  {
    value: OrgBoundary.OPERATIONAL_CONTROL,
    label: "Operational Control",
    desc: "100% of emissions from operations you control",
    badge: "Most Common",
  },
  {
    value: OrgBoundary.FINANCIAL_CONTROL,
    label: "Financial Control",
    desc: "Emissions where you have financial control",
    badge: null,
  },
  {
    value: OrgBoundary.EQUITY_SHARE,
    label: "Equity Share",
    desc: "Emissions based on your equity share percentage",
    badge: null,
  },
  {
    value: OrgBoundary.NOT_DEFINED,
    label: "Not Yet Defined",
    desc: "Boundary approach not yet determined",
    badge: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECOMMENDATION LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function getRecommended(a: ToggleAnswers): number[] {
  const base = [1, 2, 3, 5, 6, 7];
  const extra: number[] = [];
  if (a.hasSoldProducts) extra.push(9, 10, 11, 12);
  if (a.hasThirdPartyLogistics) extra.push(4, 9);
  if (a.hasManufacturing) extra.push(2, 5);
  if (a.hasLeasedAssets) extra.push(8, 13);
  if (a.hasInvestments) extra.push(15);
  return [...new Set([...base, ...extra])].sort((a, b) => a - b);
}

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────────────────────────────────────────

function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span
        className={`text-[11px] font-semibold transition-colors ${value === false ? "text-[#1D1F21]" : "text-[#9CA3AF]"}`}
      >
        No
      </span>
      <button
        onClick={() => onChange(value !== true)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${value === true ? "bg-[#0F5F4B]" : "bg-[#E5E7EB]"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${value === true ? "left-[22px]" : "left-0.5"}`}
        />
      </button>
      <span
        className={`text-[11px] font-semibold transition-colors ${value === true ? "text-[#0F5F4B]" : "text-[#9CA3AF]"}`}
      >
        Yes
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Step1_OperationalScreening() {
  const { goNext, goBack } = useNavigation();
  const { state, dispatch } = useAssessment();

  const [answers, setAnswers] = useState<ToggleAnswers>({
    hasSoldProducts: null,
    hasBusinessTravel: null,
    hasThirdPartyLogistics: null,
    hasManufacturing: null,
    hasLeasedAssets: null,
    hasInvestments: null,
  });

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const allAnswered = answeredCount === QUESTIONS.length;
  const recommendedIds = getRecommended(answers);
  const showRecommendation = answeredCount >= 3;

  const setAnswer = (id: QuestionId, v: boolean) =>
    setAnswers((prev) => ({ ...prev, [id]: v }));

  // boundary from context
  const boundary = state.companyProfile.orgBoundary;
  const setBoundary = (v: string) =>
    dispatch({
      type: "UPDATE_COMPANY",
      payload: {
        orgBoundary: v as (typeof OrgBoundary)[keyof typeof OrgBoundary],
      },
    });

  const canProceed = allAnswered && boundary !== null;

  const handleNext = () => {
    recommendedIds.forEach((id) =>
      dispatch({
        type: "SET_CATEGORY_RESPONSE",
        payload: {
          categoryId: id,
          data: { applicability: ApplicabilityStatus.APPLICABLE },
        },
      }),
    );
    SCOPE3_CATEGORIES.filter((c) => !recommendedIds.includes(c.id)).forEach(
      (c) =>
        dispatch({
          type: "SET_CATEGORY_RESPONSE",
          payload: {
            categoryId: c.id,
            data: { applicability: ApplicabilityStatus.POTENTIAL },
          },
        }),
    );
    goNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto min-w-0">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 sm:gap-4 mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <ScanSearch size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 1 of 5
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#1D1F21] leading-tight">
            Operational Screening & Boundary
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#6B7280] mt-1">
            Define your reporting boundary and identify applicable Scope 3
            categories.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Boundary" },
          { id: 2, label: "Screening" },
          { id: 3, label: "Results" },
        ]}
        current={boundary ? (allAnswered ? 3 : 2) : 1}
      />

      {/* ── Section 1: Boundary ── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            1
          </div>
          <span className="text-[13px] font-semibold text-[#1D1F21]">
            Organizational Boundary
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="group relative cursor-help">
            <Info size={13} className="text-[#9CA3AF]" />
            <span className="absolute right-0 w-56 bg-[#1D1F21] text-white text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed shadow-xl">
              Defines which entities are included in your GHG emissions
              inventory
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOUNDARY_OPTIONS.map((opt) => {
            const isSelected = boundary === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setBoundary(opt.value)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 ${isSelected ? "border-[#0F5F4B] bg-[#F3FBF7] shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#1FA971]/50"}`}
              >
                {opt.badge && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold text-[#1FA971] bg-[#E8F7F0] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {opt.badge}
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#0F5F4B] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                )}
                <div
                  className={`text-[13px] font-semibold mb-1 ${isSelected ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}
                >
                  {opt.label}
                </div>
                <div className="text-[11px] text-[#6B7280] leading-relaxed pr-10">
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section 2: Operational Screening ── */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            2
          </div>
          <span className="text-[13px] font-semibold text-[#1D1F21]">
            Operational Screening
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-[12px] font-semibold text-[#6B7280] tabular-nums">
            {answeredCount}/{QUESTIONS.length}
          </span>
        </div>

        {/* progress bar */}
        <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#1FA971] rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q) => {
            const val = answers[q.id];
            const isAnswered = val !== null;
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${isAnswered && val === true ? "border-[#1FA971]/40 shadow-sm" : "border-[#E5E7EB]"}`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-[20px] sm:text-[22px] font-bold text-[#E5E7EB] leading-none shrink-0 mt-0.5 tabular-nums">
                    {q.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#1D1F21] leading-snug mb-1">
                          {q.title}
                        </h3>
                        <p className="text-[11px] sm:text-[12px] text-[#6B7280] leading-relaxed">
                          {q.desc}
                        </p>
                      </div>
                      <ToggleSwitch
                        value={val}
                        onChange={(v) => setAnswer(q.id, v)}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                        {q.tag}
                      </span>
                      {isAnswered && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${val ? "bg-[#F3FBF7] text-[#1FA971]" : "bg-[#F3F4F6] text-[#6B7280]"}`}
                        >
                          {val ? "✓ Applicable" : "✗ Not applicable"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Recommendation ── */}
      {showRecommendation && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#0F5F4B] flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="text-[13px] font-semibold text-[#1D1F21]">
              {allAnswered
                ? "Your applicable categories"
                : "Preliminary recommendations"}
            </span>
            <span className="ml-auto text-[11px] font-semibold text-[#1FA971] bg-[#F3FBF7] px-2 py-0.5 rounded-full">
              {recommendedIds.length} categories
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendedIds.map((id) => {
              const cat = SCOPE3_CATEGORIES.find((c) => c.id === id);
              if (!cat) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl"
                >
                  <span className="w-5 h-5 rounded-lg bg-[#0F5F4B] text-white text-[9px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                    {id}
                  </span>
                  <span className="text-[11px] font-medium text-[#1D1F21]">
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
          {!allAnswered && (
            <p className="text-[11px] text-[#9CA3AF] mt-3 border-t border-[#E5E7EB] pt-3">
              Answer all {QUESTIONS.length} questions to finalize
              recommendations.
            </p>
          )}
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
        <div className="flex items-center gap-3">
          {!canProceed && (
            <span className="text-[12px] text-[#9CA3AF]">
              {!boundary
                ? "Select a boundary first"
                : `${QUESTIONS.length - answeredCount} questions remaining`}
            </span>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${canProceed ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5" : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"}`}
          >
            Next: Review Categories
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

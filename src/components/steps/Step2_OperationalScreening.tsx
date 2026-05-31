import { ScanSearch, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import { ApplicabilityStatus } from "@/types/assessment.types";
import MicroStepper from "@/components/ui/MicroStepper";

// DATA

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
type ToggleValue = boolean | null;
type ToggleAnswers = Record<QuestionId, ToggleValue>;

// RECOMMENDATION LOGIC
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

// TOGGLE SWITCH SUB-COMPONENT

function ToggleSwitch({
  value,
  onChange,
}: {
  value: ToggleValue;
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
        className={`
          relative w-11 h-6 rounded-full transition-all duration-300 shrink-0
          ${
            value === true
              ? "bg-[#0F5F4B]"
              : value === false
                ? "bg-[#E5E7EB]"
                : "bg-[#E5E7EB]"
          }
        `}
      >
        <span
          className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm
            transition-all duration-300
            ${value === true ? "left-5.5" : "left-0.5"}
          `}
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

// COMPONENT

export default function Step2_OperationalScreening() {
  const { goNext, goBack } = useNavigation();
  const { dispatch } = useAssessment();

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
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <ScanSearch size={22} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 2 of 6
          </div>
          <h2 className="text-[22px] font-bold text-[#1D1F21] leading-tight">
            Operational Screening
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Quick questions to identify your applicable Scope 3 categories.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Questions" },
          { id: 2, label: "Recommendations" },
        ]}
        current={allAnswered ? 2 : 1}
      />
      {/* ── Progress bar ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1FA971] rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="text-[12px] font-semibold text-[#6B7280] shrink-0 tabular-nums">
          {answeredCount}/{QUESTIONS.length}
        </span>
      </div>

      {/* ── Questions ── */}
      <div className="space-y-3 mb-6">
        {QUESTIONS.map((q) => {
          const val = answers[q.id];
          const isAnswered = val !== null;
          return (
            <div
              key={q.id}
              className={`
                bg-white rounded-2xl border transition-all duration-200 p-5
                ${
                  isAnswered && val === true
                    ? "border-[#1FA971]/40 shadow-sm"
                    : isAnswered
                      ? "border-[#E5E7EB]"
                      : "border-[#E5E7EB] hover:border-[#1FA971]/30"
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* number */}
                <span className="text-[22px] font-bold text-[#E5E7EB] leading-none shrink-0 mt-0.5 tabular-nums">
                  {q.number}
                </span>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#1D1F21] leading-snug mb-1">
                        {q.title}
                      </h3>
                      <p className="text-[12px] text-[#6B7280] leading-relaxed">
                        {q.desc}
                      </p>
                    </div>
                    <ToggleSwitch
                      value={val}
                      onChange={(v) => setAnswer(q.id, v)}
                    />
                  </div>

                  {/* tag + answered indicator */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[10px] font-semibold text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
                      {q.tag}
                    </span>
                    {isAnswered && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          val
                            ? "bg-[#F3FBF7] text-[#1FA971]"
                            : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
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

      {/* ── AI Recommendation panel ── */}
      {showRecommendation && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#0F5F4B] flex items-center justify-center">
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
      <div className="flex items-center justify-between pb-10">
        <button
          onClick={goBack}
          className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:text-[#1D1F21] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all duration-200"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          {!allAnswered && (
            <span className="text-[12px] text-[#9CA3AF]">
              {QUESTIONS.length - answeredCount} questions remaining
            </span>
          )}
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold
              transition-all duration-200
              ${
                allAnswered
                  ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              }
            `}
          >
            Next: Review Categories
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

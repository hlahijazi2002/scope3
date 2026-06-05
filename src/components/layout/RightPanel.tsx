import { useState } from "react";
import {
  Bot,
  BookOpen,
  ExternalLink,
  Sparkles,
  X,
  PanelRight,
} from "lucide-react";
import { useNavigation, useAssessment } from "@/hooks/useAssessment";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import { ApplicabilityStatus } from "@/types/assessment.types";

// GUIDANCE DATA

const STEP_GUIDANCE: Record<
  number,
  {
    ai: string[];
    ghg: { title: string; body: string }[];
    resources: { label: string; url: string }[];
  }
> = {
  1: {
    ai: [
      "Defining your organizational boundary early ensures accurate Scope 3 accounting across all 15 categories.",
      "Operational Control is the most common boundary approach used by manufacturing companies.",
    ],
    ghg: [
      {
        title: "Organizational Boundaries",
        body: "Companies must consolidate GHG emissions based on equity share, financial control, or operational control approaches.",
      },
      {
        title: "Reporting Year",
        body: "The reporting year should align with your financial year for consistency in data collection.",
      },
    ],
    resources: [
      {
        label: "GHG Protocol — Corporate Value Chain (Scope 3) Standard",
        url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard",
      },
    ],
  },
  2: {
    ai: [
      "Your industry and operational activities determine which Scope 3 categories are most material to your footprint.",
      "Companies with significant procurement spend typically find Category 1 to be their largest Scope 3 source.",
    ],
    ghg: [
      {
        title: "Materiality Screening",
        body: "Focus on categories that are likely to be significant based on your sector, spend, and operational profile.",
      },
    ],
    resources: [
      {
        label: "GHG Protocol — Corporate Value Chain (Scope 3) Standard",
        url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard",
      },
    ],
  },
  3: {
    ai: [
      "For manufacturing companies, Purchased Goods & Services typically represents 40–60% of total Scope 3 emissions.",
      "Mark categories as Potential if you're unsure — you can refine later during data collection.",
    ],
    ghg: [
      {
        title: "Applicability Criteria",
        body: "A category is applicable if the activity occurs within your value chain during the reporting year.",
      },
      {
        title: "Not Applicable Flag",
        body: "Only select Not Applicable if the activity genuinely does not occur in your value chain.",
      },
    ],
    resources: [
      {
        label: "GHG Protocol — Corporate Value Chain (Scope 3) Standard",
        url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard",
      },
    ],
  },
  4: {
    ai: [
      "Spend-based methods are a good starting point when primary activity data is unavailable.",
      "Supplier-specific data provides the most accurate emissions estimates for Category 1.",
    ],
    ghg: [
      {
        title: "Spend-Based Method",
        body: "Uses financial data multiplied by environmentally-extended input-output (EEIO) emission factors.",
      },
      {
        title: "Activity-Based Method",
        body: "Uses quantity data (kg, liters, units) with product-level emission factors for higher accuracy.",
      },
    ],
    resources: [
      {
        label: "GHG Protocol — Corporate Value Chain (Scope 3) Standard",
        url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard",
      },
    ],
  },
  5: {
    ai: [
      "A data readiness score above 60% indicates you have enough data to begin quantification.",
      "Planned data collection should be prioritized for your most material categories.",
    ],
    ghg: [
      {
        title: "Data Quality",
        body: "Higher quality data leads to more accurate emissions estimates and credible reporting.",
      },
      {
        title: "Estimation Methods",
        body: "Where primary data is unavailable, industry averages or proxy data may be used with appropriate disclosure.",
      },
    ],
    resources: [
      {
        label: "GHG Protocol — Corporate Value Chain (Scope 3) Standard",
        url: "https://ghgprotocol.org/corporate-value-chain-scope-3-standard",
      },
    ],
  },
};

// CATEGORY GUIDANCE

const CATEGORY_GUIDANCE: Record<
  number,
  { ai: string; ghg: { title: string; body: string } }
> = {
  1: {
    ai: "Cat 1 is typically the largest Scope 3 source for manufacturers. Engage top 10 suppliers by spend first.",
    ghg: {
      title: "Purchased Goods & Services",
      body: "Includes all upstream emissions from production of goods/services purchased in the reporting year.",
    },
  },
  2: {
    ai: "Capital goods emissions are often one-time but significant. Use asset register data for accuracy.",
    ghg: {
      title: "Capital Goods",
      body: "Covers emissions from production of long-lived assets purchased or acquired by the company.",
    },
  },
  3: {
    ai: "Fuel & energy related activities are often overlooked but can be significant for energy-intensive companies.",
    ghg: {
      title: "Fuel & Energy Activities",
      body: "Includes upstream emissions from extraction, production, and transportation of fuels and energy.",
    },
  },
  4: {
    ai: "Distance-based data gives more accurate results than spend-based for transportation categories.",
    ghg: {
      title: "Upstream Transportation",
      body: "All third-party transportation of purchased goods to the reporting company.",
    },
  },
  5: {
    ai: "Waste disposal method significantly impacts emissions. Landfill vs. recycling can be 10x difference.",
    ghg: {
      title: "Waste Generated",
      body: "Emissions from disposal and treatment of waste generated in company operations.",
    },
  },
  6: {
    ai: "Air travel dominates business travel emissions. Distance-based calculation is most accurate.",
    ghg: {
      title: "Business Travel",
      body: "Emissions from employee travel for business purposes in vehicles not owned by the company.",
    },
  },
  7: {
    ai: "Employee surveys are the primary data source. Even a sample of 30% gives reliable estimates.",
    ghg: {
      title: "Employee Commuting",
      body: "Emissions from employee travel between home and work sites, including telework.",
    },
  },
  8: {
    ai: "Operational control boundary means leased assets under your control must be included in Scope 1/2, not here.",
    ghg: {
      title: "Upstream Leased Assets",
      body: "Emissions from assets leased by company not included in Scope 1 or 2.",
    },
  },
  9: {
    ai: "Work with your logistics provider to get fuel data. Many 3PLs now offer carbon reporting dashboards.",
    ghg: {
      title: "Downstream Transportation",
      body: "Emissions from third-party transportation of sold products to end customers.",
    },
  },
  10: {
    ai: "This category requires detailed knowledge of your customers' manufacturing processes.",
    ghg: {
      title: "Processing of Sold Products",
      body: "Emissions from further processing of sold intermediate products by customers.",
    },
  },
  11: {
    ai: "For energy-using products, lifetime energy consumption data is the key input.",
    ghg: {
      title: "Use of Sold Products",
      body: "Emissions from end-use of goods and services sold by the reporting company.",
    },
  },
  12: {
    ai: "Material composition data from your product specs is the starting point for end-of-life calculations.",
    ghg: {
      title: "End-of-Life Treatment",
      body: "Emissions from waste disposal and treatment of products sold by the company.",
    },
  },
  13: {
    ai: "Collect utility bills from lessees or use floor area-based estimates as a proxy.",
    ghg: {
      title: "Downstream Leased Assets",
      body: "Emissions from assets owned by reporting company and leased to others.",
    },
  },
  14: {
    ai: "Request energy and fuel data directly from franchisees through annual reporting.",
    ghg: {
      title: "Franchises",
      body: "Emissions from franchise operations not included in Scope 1 or 2.",
    },
  },
  15: {
    ai: "Financed emissions (Cat 15) are becoming mandatory under many frameworks. Start with PCAF methodology.",
    ghg: {
      title: "Investments",
      body: "Emissions associated with investments and financial activities of the reporting company.",
    },
  },
};

// PANEL CONTENT

function PanelContent({ onClose }: { onClose?: () => void }) {
  const { currentStep } = useNavigation();
  const { state } = useAssessment();

  const activeCategoryId: number | null = (() => {
    if (currentStep !== 4) return null;
    const applicable = SCOPE3_CATEGORIES.filter(
      (c) =>
        state.categoryResponses[c.id]?.applicability ===
        ApplicabilityStatus.APPLICABLE,
    );
    return applicable[0]?.id ?? null;
  })();

  const guidance = STEP_GUIDANCE[currentStep] ?? STEP_GUIDANCE[1];
  const catGuidance = activeCategoryId
    ? CATEGORY_GUIDANCE[activeCategoryId]
    : null;

  const applicableCount = Object.values(state.categoryResponses).filter(
    (r) => r.applicability === ApplicabilityStatus.APPLICABLE,
  ).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto py-5 px-4">
      {/* mobile close */}
      {onClose && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-bold text-[#1D1F21]">Guidance</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          >
            <X size={14} className="text-[#6B7280]" />
          </button>
        </div>
      )}

      {/* Active Category — Step 4 */}
      {currentStep === 4 && catGuidance && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3">
            Active Category
          </div>
          <div className="bg-gradient-to-br from-[#F3FBF7] to-[#e0f4ea] border border-[#c6e9d9] rounded-xl p-3 mb-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={11} className="text-[#0F5F4B]" />
              <span className="text-[10px] font-bold text-white bg-[#1FA971] px-1.5 py-0.5 rounded">
                Tip
              </span>
            </div>
            <p className="text-[11px] text-[#2d6e54] leading-relaxed">
              {catGuidance.ai}
            </p>
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen size={11} className="text-[#6B7280]" />
              <span className="text-[12px] font-semibold text-[#1D1F21]">
                {catGuidance.ghg.title}
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">
              {catGuidance.ghg.body}
            </p>
          </div>
        </div>
      )}

      {/* Progress */}
      {currentStep >= 3 && (
        <div className="mb-5">
          <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3">
            Progress
          </div>
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold text-[#1D1F21]">
                Applicable
              </span>
              <span className="text-[14px] font-bold text-[#1FA971]">
                {applicableCount} / 15
              </span>
            </div>
            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1FA971] rounded-full transition-all duration-500"
                style={{ width: `${(applicableCount / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Guidance */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3">
          AI Guidance
        </div>
        <div className="space-y-2">
          {guidance.ai.map((tip, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-[#F3FBF7] to-[#e0f4ea] border border-[#c6e9d9] rounded-xl p-3"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Bot size={11} className="text-[#0F5F4B]" />
                <span className="text-[10px] font-bold text-white bg-[#1FA971] px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#2d6e54] leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GHG Protocol */}
      <div className="mb-5">
        <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3">
          GHG Protocol
        </div>
        <div className="space-y-2">
          {guidance.ghg.map((item, i) => (
            <div
              key={i}
              className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <BookOpen size={11} className="text-[#6B7280]" />
                <span className="text-[12px] font-semibold text-[#1D1F21]">
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <div className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest mb-3">
          Resources
        </div>
        <div className="space-y-1.5">
          {guidance.resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[12px] text-[#1F7AE0] hover:underline"
            >
              <ExternalLink size={11} />
              {res.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// MAIN COMPONENT

export default function RightPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Mobile toggle button — fixed bottom right (above AI FAB) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 lg:hidden w-12 h-12 rounded-full bg-white border border-[#E5E7EB] text-[#0F5F4B] shadow-lg flex items-center justify-center hover:bg-[#F3FBF7] transition-colors"
      >
        <PanelRight size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile drawer — slides from right ── */}
      <div
        className={`
        fixed top-0 right-0 h-full w-[300px] bg-white z-50 shadow-2xl
        transition-transform duration-300 lg:hidden
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <PanelContent onClose={() => setIsOpen(false)} />
      </div>

      {/* ── Desktop — always visible ── */}
      <aside className="hidden lg:flex w-[268px] shrink-0 bg-white border-l border-[#E5E7EB] flex-col">
        <PanelContent />
      </aside>
    </>
  );
}

import { Building2, Info, ChevronRight } from "lucide-react";
import { useCompanyProfile, useNavigation } from "@/hooks/useAssessment";
import { OrgBoundary } from "@/types/assessment.types";
import MicroStepper from "@/components/ui/MicroStepper";

// DATA

const INDUSTRIES = [
  "Manufacturing",
  "Financial Services",
  "Retail & Consumer Goods",
  "Technology & Software",
  "Energy & Utilities",
  "Healthcare",
  "Logistics & Transportation",
  "Construction & Real Estate",
  "Food & Beverage",
  "Chemicals & Materials",
  "Other",
];

const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "China",
  "Singapore",
  "Australia",
  "Canada",
  "Netherlands",
  "Japan",
  "South Korea",
  "Turkey",
  "Egypt",
  "South Africa",
  "Brazil",
  "Other",
];

const REPORTING_YEARS = ["2025", "2024", "2023", "2022", "2021"];

const EMPLOYEE_RANGES = [
  "1–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001–5,000",
  "5,001–10,000",
  "10,000+",
];

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

// SUB-COMPONENTS
function FieldLabel({
  label,
  tooltip,
  required,
}: {
  label: string;
  tooltip?: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
      {label}
      {required && (
        <span className="text-red-400 normal-case tracking-normal">*</span>
      )}
      {tooltip && (
        <span className="group relative cursor-help">
          <Info
            size={12}
            className="text-[#6B7280]/50 hover:text-[#6B7280] transition-colors"
          />
          <span className="absolute left-5 -top-1 w-52 bg-[#1D1F21] text-white text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed shadow-xl">
            {tooltip}
          </span>
        </span>
      )}
    </label>
  );
}

function StyledInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[13px] font-['Poppins'] text-[#1D1F21] placeholder-[#9CA3AF] outline-none focus:border-[#1FA971] focus:ring-4 focus:ring-[#1FA971]/10 transition-all duration-200"
    />
  );
}

function StyledSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[13px] font-['Poppins'] text-[#1D1F21] outline-none focus:border-[#1FA971] focus:ring-4 focus:ring-[#1FA971]/10 transition-all duration-200 appearance-none cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronRight
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#9CA3AF] pointer-events-none"
      />
    </div>
  );
}

// COMPONENT
export default function Step1_CompanyProfile() {
  const { profile, updateField, isProfileComplete } = useCompanyProfile();
  const { goNext, goToStep } = useNavigation();

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <Building2 size={22} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 1 of 6
          </div>
          <h2 className="text-[22px] font-bold text-[#1D1F21] leading-tight">
            Company Profile
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Tell us about your organization to tailor the assessment.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Basic Info" },
          { id: 2, label: "Boundary" },
        ]}
        current={profile.orgBoundary ? 2 : 1}
      />
      {/* ── Section: Basic Info ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center">
            1
          </div>
          <span className="text-[13px] font-semibold text-[#1D1F21]">
            Basic Information
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-5 shadow-sm">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <FieldLabel label="Company Name" required />
              <StyledInput
                value={profile.name}
                onChange={(v) => updateField("name", v)}
                placeholder="e.g. Acme Corporation"
              />
            </div>
            <div>
              <FieldLabel label="Reporting Year" required />
              <StyledSelect
                value={profile.reportingYear}
                onChange={(v) => updateField("reportingYear", v)}
                placeholder="Select year..."
                options={REPORTING_YEARS}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <FieldLabel
                label="Industry Sector"
                required
                tooltip="Select your primary industry for AI-powered category suggestions"
              />
              <StyledSelect
                value={profile.industry}
                onChange={(v) => updateField("industry", v)}
                placeholder="Select sector..."
                options={INDUSTRIES}
              />
            </div>
            <div>
              <FieldLabel label="Country of Operation" required />
              <StyledSelect
                value={profile.country}
                onChange={(v) => updateField("country", v)}
                placeholder="Select country..."
                options={COUNTRIES}
              />
            </div>
          </div>

          <div>
            <FieldLabel label="Number of Employees" />
            <StyledSelect
              value={profile.employeeCount}
              onChange={(v) => updateField("employeeCount", v)}
              placeholder="Select range..."
              options={EMPLOYEE_RANGES}
            />
          </div>
        </div>
      </div>

      {/* ── Section: Boundary ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center">
            2
          </div>
          <span className="text-[13px] font-semibold text-[#1D1F21]">
            Organizational Boundary
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="group relative cursor-help">
            <Info size={13} className="text-[#9CA3AF]" />
            <span className="absolute right-0 w-56 bg-[#1D1F21] text-white text-[11px] rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none leading-relaxed -top-1 shadow-xl">
              Defines which entities are included in your GHG emissions
              inventory
            </span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {BOUNDARY_OPTIONS.map((opt) => {
            const isSelected = profile.orgBoundary === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateField("orgBoundary", opt.value)}
                className={`
                  relative text-left p-4 rounded-2xl border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#0F5F4B] bg-[#F3FBF7] shadow-sm"
                      : "border-[#E5E7EB] bg-white hover:border-[#1FA971]/50 hover:bg-[#F9FAFB]"
                  }
                `}
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
                <div className="text-[11px] text-[#6B7280] leading-relaxed pr-12">
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Nav ── */}
      <div className="flex items-center justify-between pb-10">
        <button
          onClick={() => goToStep(0)}
          className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#6B7280] hover:text-[#1D1F21] hover:bg-white border border-transparent hover:border-[#E5E7EB] transition-all duration-200"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          {!isProfileComplete && (
            <span className="text-[12px] text-[#9CA3AF]">
              Fill required fields to continue
            </span>
          )}
          <button
            onClick={goNext}
            disabled={!isProfileComplete}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold
              transition-all duration-200
              ${
                isProfileComplete
                  ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39] hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              }
            `}
          >
            Next: Operational Screening
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

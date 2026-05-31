import { useState, useEffect } from "react";
import { X, Plus, Building2, Globe, DollarSign, Database } from "lucide-react";
import TrafficLight from "@/components/ui/TrafficLight";
import type {
  Supplier,
  SupplierDataAvailability,
} from "@/types/assessment.types";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface SupplierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  existing?: Supplier | null;
}

interface FormState {
  name: string;
  type: string;
  country: string;
  annualSpend: string;
  dataAvailability: SupplierDataAvailability | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUPPLIER_TYPES = [
  "Metals & Minerals",
  "Chemicals & Industrial Materials",
  "Packaging Materials",
  "IT Equipment & Software",
  "Professional Services",
  "Logistics & Transport",
  "Facility & Operational Services",
  "Other",
];

const COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "United States",
  "United Kingdom",
  "Germany",
  "China",
  "India",
  "France",
  "Netherlands",
  "Singapore",
  "Japan",
  "South Korea",
  "Turkey",
  "Egypt",
  "Other",
];

const EMPTY_FORM: FormState = {
  name: "",
  type: "",
  country: "",
  annualSpend: "",
  dataAvailability: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SupplierDrawer({
  isOpen,
  onClose,
  onSave,
  existing,
}: SupplierDrawerProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // populate form if editing existing supplier
  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        type: existing.type,
        country: existing.country,
        annualSpend: existing.annualSpend,
        dataAvailability: existing.dataAvailability,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [existing, isOpen]);

  // ── helpers ──

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Supplier name is required";
    if (!form.type) e.type = "Please select a supplier type";
    if (!form.country) e.country = "Please select a country";
    if (!form.dataAvailability)
      e.dataAvailability = "Please select data availability";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = (addAnother = false) => {
    if (!validate()) return;
    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      type: form.type,
      country: form.country,
      annualSpend: form.annualSpend,
      dataAvailability: form.dataAvailability as SupplierDataAvailability,
    });
    if (addAnother) {
      setForm(EMPTY_FORM);
      setErrors({});
    } else {
      onClose();
    }
  };

  // ── traffic light adapter ──
  const trafficValue =
    form.dataAvailability === "not_available"
      ? "not_available"
      : form.dataAvailability === "partial"
        ? "partial"
        : form.dataAvailability === "available"
          ? "available"
          : null;

  const handleTraffic = (v: "available" | "partial" | "not_available") => {
    set("dataAvailability", v as SupplierDataAvailability);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] bg-white z-50 shadow-2xl
          flex flex-col overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F3FBF7] flex items-center justify-center">
              <Building2 size={16} className="text-[#0F5F4B]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#1D1F21]">
                {existing ? "Edit Supplier" : "Add Supplier"}
              </div>
              <div className="text-[11px] text-[#6B7280]">
                Scope 3 Category 1
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors"
          >
            <X size={14} className="text-[#6B7280]" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Supplier Name */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1D1F21] mb-1.5">
              Supplier Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Tata Steel Ltd."
              className={`
                w-full px-3 py-2.5 rounded-lg border-[1.5px] text-[13px]
                font-['Poppins'] text-[#1D1F21] outline-none
                transition-colors duration-200
                ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-[#E5E7EB] bg-white focus:border-[#1FA971] focus:ring-2 focus:ring-[#1FA971]/10"
                }
              `}
            />
            {errors.name && (
              <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Supplier Type */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1D1F21] mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Database size={13} className="text-[#6B7280]" />
                Supplier Type <span className="text-red-400">*</span>
              </span>
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              className={`
                w-full px-3 py-2.5 rounded-lg border-[1.5px] text-[13px]
                font-['Poppins'] text-[#1D1F21] outline-none bg-white
                transition-colors duration-200 cursor-pointer
                ${
                  errors.type
                    ? "border-red-400 bg-red-50"
                    : "border-[#E5E7EB] focus:border-[#1FA971] focus:ring-2 focus:ring-[#1FA971]/10"
                }
              `}
            >
              <option value="">Select type...</option>
              {SUPPLIER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-[11px] text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1D1F21] mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Globe size={13} className="text-[#6B7280]" />
                Country <span className="text-red-400">*</span>
              </span>
            </label>
            <select
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
              className={`
                w-full px-3 py-2.5 rounded-lg border-[1.5px] text-[13px]
                font-['Poppins'] text-[#1D1F21] outline-none bg-white
                transition-colors duration-200 cursor-pointer
                ${
                  errors.country
                    ? "border-red-400 bg-red-50"
                    : "border-[#E5E7EB] focus:border-[#1FA971] focus:ring-2 focus:ring-[#1FA971]/10"
                }
              `}
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-[11px] text-red-500 mt-1">{errors.country}</p>
            )}
          </div>

          {/* Annual Spend */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1D1F21] mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <DollarSign size={13} className="text-[#6B7280]" />
                Annual Spend (USD)
                <span className="text-[11px] text-[#6B7280] font-normal">
                  — optional
                </span>
              </span>
            </label>
            <input
              type="text"
              value={form.annualSpend}
              onChange={(e) => set("annualSpend", e.target.value)}
              placeholder="e.g. 2,400,000"
              className="w-full px-3 py-2.5 rounded-lg border-[1.5px] border-[#E5E7EB] text-[13px] font-['Poppins'] text-[#1D1F21] outline-none focus:border-[#1FA971] focus:ring-2 focus:ring-[#1FA971]/10 transition-colors duration-200"
            />
          </div>

          {/* Data Availability */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1D1F21] mb-1">
              Data Availability <span className="text-red-400">*</span>
            </label>
            <TrafficLight value={trafficValue} onChange={handleTraffic} />
            {errors.dataAvailability && (
              <p className="text-[11px] text-red-500 mt-1">
                {errors.dataAvailability}
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex gap-3 flex-shrink-0">
          <button
            onClick={() => handleSave(false)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F5F4B] text-white text-[13px] font-semibold hover:bg-[#0a4a39] transition-colors"
          >
            Save Supplier
          </button>
          {!existing && (
            <button
              onClick={() => handleSave(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-[1.5px] border-[#0F5F4B] text-[#0F5F4B] text-[13px] font-medium hover:bg-[#F3FBF7] transition-colors"
            >
              <Plus size={14} />
              Save & Add Another
            </button>
          )}
        </div>
      </div>
    </>
  );
}

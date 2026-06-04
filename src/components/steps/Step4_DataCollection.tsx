import { useState } from "react";
import {
  Database,
  Search,
  Plus,
  Trash2,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import {
  useNavigation,
  useAssessment,
  usePurchasedGoods,
} from "@/hooks/useAssessment";
import { ApplicabilityStatus } from "@/types/assessment.types";
import {
  SCOPE3_CATEGORIES,
  PURCHASED_GOODS_SUBCATEGORIES,
  PURCHASED_GOODS_EXAMPLES,
  MONITORING_METHOD_OPTIONS,
  PRIMARY_DATA_SOURCES,
} from "@/data/scope3Categories";
import UploadCard from "@/components/ui/UploadCard";
import SupplierDrawer from "@/components/ui/SupplierDrawer";
import type { Supplier } from "@/types/assessment.types";
import MicroStepper from "../ui/MicroStepper";

// SECTION HEADER

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
        {number}
      </div>
      <span className="text-[13px] font-semibold text-[#1D1F21]">{title}</span>
      <div className="flex-1 h-px bg-[#E5E7EB]" />
    </div>
  );
}

// CATEGORY TAB BAR — horizontally scrollable on all sizes
function CategoryTabBar({
  categories,
  activeId,
  onSelect,
}: {
  categories: typeof SCOPE3_CATEGORIES;
  activeId: number;
  onSelect: (id: number) => void;
  responses: Record<number, { applicability: string }>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl border shrink-0
              text-[11px] sm:text-[12px] font-semibold transition-all duration-200
              ${
                isActive
                  ? "bg-[#0F5F4B] text-white border-[#0F5F4B] shadow-sm"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1FA971]/40 hover:text-[#1D1F21]"
              }
            `}
          >
            <span
              className={`w-4 h-4 rounded-md text-[9px] font-bold flex items-center justify-center shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}
            >
              {cat.id}
            </span>
            {/* Show abbreviated name on mobile */}
            <span className="sm:hidden">{cat.name.split(" ")[0]}</span>
            <span className="hidden sm:inline">
              {cat.name.split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// PURCHASED GOODS PANEL (Cat 1)

function PurchasedGoodsPanel() {
  const {
    purchasedGoods,
    toggleCategory,
    toggleItem,
    addSupplier,
    removeSupplier,
  } = usePurchasedGoods();
  const { state, dispatch } = useAssessment();
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const response = state.categoryResponses[1];

  const filteredCategories = Object.keys(PURCHASED_GOODS_SUBCATEGORIES).filter(
    (cat) =>
      cat.toLowerCase().includes(search.toLowerCase()) ||
      PURCHASED_GOODS_SUBCATEGORIES[cat].some((sub) =>
        sub.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  const monitoringOptions = MONITORING_METHOD_OPTIONS.map((m) => ({
    id: m.id,
    label: m.label,
  }));
  const dataSourceOptions = PRIMARY_DATA_SOURCES.map((s) => ({
    id: s,
    label: s,
  }));

  const toggleMethod = (id: string) => {
    const current = (response?.monitoringMethods ?? []) as string[];
    const updated = current.includes(id)
      ? current.filter((m) => m !== id)
      : [...current, id];
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: {
        categoryId: 1,
        data: { monitoringMethods: updated as never[] },
      },
    });
  };

  const toggleSource = (id: string) => {
    const current = response?.primaryDataSources ?? [];
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: { categoryId: 1, data: { primaryDataSources: updated } },
    });
  };

  const handleSaveSupplier = (supplier: Supplier) => {
    addSupplier(supplier);
    setDrawerOpen(false);
    setEditSupplier(null);
  };

  return (
    <>
      {/* ── 1: Procurement categories ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader
          number="1"
          title="What types of goods or services does your organization procure?"
        />

        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] font-['Poppins'] text-[#1D1F21] outline-none focus:border-[#1FA971] focus:ring-4 focus:ring-[#1FA971]/10 transition-all"
          />
        </div>

        <div className="space-y-2">
          {filteredCategories.map((cat) => {
            const isSelected = purchasedGoods.selectedCategories.includes(cat);
            const subItems = PURCHASED_GOODS_SUBCATEGORIES[cat];
            const selectedSubs = subItems.filter((s) =>
              purchasedGoods.selectedItems.includes(s),
            );

            return (
              <div
                key={cat}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${isSelected ? "border-[#1FA971]/40" : "border-[#E5E7EB]"}`}
              >
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? "bg-[#F3FBF7]" : "bg-white hover:bg-[#F9FAFB]"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border-[1.5px] transition-colors ${isSelected ? "bg-[#0F5F4B] border-[#0F5F4B]" : "border-[#D1D5DB]"}`}
                    >
                      {isSelected && (
                        <span className="text-white text-[9px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[13px] font-semibold ${isSelected ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}
                    >
                      {cat}
                    </span>
                    {selectedSubs.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#1FA971] bg-[#F3FBF7] px-2 py-0.5 rounded-full">
                        {selectedSubs.length} selected
                      </span>
                    )}
                  </div>
                </button>

                {isSelected && (
                  <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    <p className="text-[11px] text-[#9CA3AF] mb-2">
                      Select specific sub-categories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {subItems.map((sub) => {
                        const isSubSelected =
                          purchasedGoods.selectedItems.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleItem(sub)}
                            className={`
                              px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all
                              ${
                                isSubSelected
                                  ? "bg-[#0F5F4B] border-[#0F5F4B] text-white"
                                  : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"
                              }
                            `}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                    {selectedSubs.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                        <p className="text-[11px] text-[#9CA3AF] mb-1.5">
                          Examples from selected:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSubs
                            .flatMap((s) =>
                              (PURCHASED_GOODS_EXAMPLES[s] ?? []).slice(0, 3),
                            )
                            .slice(0, 8)
                            .map((ex) => (
                              <span
                                key={ex}
                                className="text-[10px] text-[#6B7280] bg-white border border-[#E5E7EB] px-2 py-0.5 rounded-full"
                              >
                                {ex}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3">
          <input
            type="text"
            placeholder="Other goods or services not listed above..."
            className="w-full px-4 py-2.5 rounded-xl border border-dashed border-[#E5E7EB] text-[13px] font-['Poppins'] text-[#1D1F21] placeholder-[#9CA3AF] outline-none focus:border-[#1FA971] focus:ring-4 focus:ring-[#1FA971]/10 transition-all bg-[#F9FAFB]"
          />
        </div>
      </div>

      {/* ── 2: Supplier capture ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-1">
          <SectionHeader number="2" title="Key Suppliers" />
        </div>
        <p className="text-[12px] text-[#9CA3AF] mb-4 -mt-2">
          Optional at this stage — improves data accuracy.
        </p>

        {purchasedGoods.suppliers.length > 0 && (
          /* Responsive table: scrolls horizontally on mobile */
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-4 overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {[
                    "Supplier",
                    "Type",
                    "Country",
                    "Annual Spend",
                    "Data",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-4 py-2.5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchasedGoods.suppliers.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-4 py-3 text-[13px] font-semibold text-[#1D1F21]">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                      {s.type}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                      {s.country}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#6B7280]">
                      {s.annualSpend || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          s.dataAvailability === "available"
                            ? "bg-[#F3FBF7] text-[#1FA971]"
                            : s.dataAvailability === "partial"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-500"
                        }`}
                      >
                        {s.dataAvailability === "available"
                          ? "Available"
                          : s.dataAvailability === "partial"
                            ? "Partial"
                            : "Not Available"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeSupplier(s.id)}
                        className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <Trash2
                          size={12}
                          className="text-[#9CA3AF] hover:text-red-400"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => {
            setEditSupplier(null);
            setDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3FBF7] border border-[#1FA971]/30 text-[#0F5F4B] text-[13px] font-semibold hover:bg-[#E8F7F0] transition-colors"
        >
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      {/* ── 3: Monitoring method ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="3" title="Data Monitoring Method" />
        <p className="text-[12px] text-[#6B7280] mb-3">
          How does your company currently track procurement data?
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {monitoringOptions.map((opt) => {
            const isSelected = (
              (response?.monitoringMethods ?? []) as string[]
            ).includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleMethod(opt.id)}
                className={`
                  px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all
                  ${
                    isSelected
                      ? "bg-[#0F5F4B] border-[#0F5F4B] text-white"
                      : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4: Data sources ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="4" title="Primary Data Sources" />
        <p className="text-[12px] text-[#6B7280] mb-3">
          Select all systems or sources used for procurement data.
        </p>
        <div className="flex flex-wrap gap-2">
          {dataSourceOptions.map((opt) => {
            const isSelected = (response?.primaryDataSources ?? []).includes(
              opt.id,
            );
            return (
              <button
                key={opt.id}
                onClick={() => toggleSource(opt.id)}
                className={`
                  px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all
                  ${
                    isSelected
                      ? "bg-[#0F5F4B] border-[#0F5F4B] text-white"
                      : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5: File uploads — 1 col mobile, 2 col sm+ ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="5" title="Supporting Data Files" />
        <p className="text-[12px] text-[#6B7280] mb-4">
          Upload procurement data files to support your assessment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UploadCard
            title="Procurement Data"
            subTitle="CSV, XLS supported"
            accept=".csv,.xlsx,.xls"
          />
          <UploadCard
            title="Invoice Data"
            subTitle="PDF, CSV supported"
            accept=".pdf,.csv"
          />
          <UploadCard
            title="Spend Data"
            subTitle="CSV, XLS supported"
            accept=".csv,.xlsx,.xls"
          />
          <UploadCard
            title="ERP Export"
            subTitle="XML, JSON, CSV"
            accept=".xml,.json,.csv"
          />
        </div>
      </div>

      <SupplierDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditSupplier(null);
        }}
        onSave={handleSaveSupplier}
        existing={editSupplier}
      />
    </>
  );
}

// CATEGORY-SPECIFIC EXTRA QUESTIONS

const TRANSPORT_MODES = [
  "Road Freight",
  "Air Freight",
  "Rail Freight",
  "Marine Shipping",
  "Courier/Parcel Services",
];

const TRAVEL_MODES = [
  "Air Travel",
  "Rail",
  "Taxi/Ride Sharing",
  "Personal Vehicles",
  "Hotel Accommodation",
];

const COMMUTE_MODES = [
  "Personal Car",
  "Carpool",
  "Bus",
  "Metro/Train",
  "Motorcycle",
  "Bicycle",
  "Walking",
  "Company Transport",
];

const WASTE_CATEGORIES = [
  "General Municipal Waste",
  "Food / Organic Waste",
  "Paper & Cardboard",
  "Plastic Waste",
  "Glass Waste",
  "Metal Scrap",
  "Wood Waste",
  "E-Waste",
  "Hazardous Waste",
  "Construction & Demolition Waste",
  "Wastewater",
];

const WASTE_DISPOSAL = [
  "Recycling",
  "Landfill",
  "Incineration",
  "Composting",
  "Waste-to-energy",
  "Hazardous treatment",
];

const CAT_MONITORING: Record<number, string[]> = {
  2: [
    "Amount Spent",
    "Quantity Purchased",
    "Asset Register Tracking",
    "Depreciation Records",
    "Not Tracked",
  ],
  4: [
    "Distance-based data (km)",
    "Fuel consumption data",
    "Freight spend/cost",
    "Shipment weight and distance",
    "Not Tracked",
  ],
  5: [
    "Weight-based (kg/tonnes)",
    "Vendor disposal certificates",
    "Waste manifests",
    "Recycling reports",
    "Vendor invoices",
    "Not Tracked",
  ],
  6: [
    "Distance traveled",
    "Travel spend/bills",
    "Travel agency records",
    "Hotel stay records",
    "Not Tracked",
  ],
  7: [
    "Employee surveys",
    "Distance estimation",
    "Attendance records",
    "Fuel reimbursement records",
    "Public transport usage",
    "Not Tracked",
  ],
  8: [
    "Lease agreements",
    "Utility consumption data",
    "Fuel consumption",
    "Facility area (m²)",
    "Vendor invoices",
    "Not Tracked",
  ],
  9: [
    "Distance-based tracking",
    "Shipment weight and distance",
    "Logistics provider data",
    "Freight spend",
    "Fuel data",
    "Not Tracked",
  ],
  10: [
    "Customer usage assumptions",
    "Product composition data",
    "Customer-specific processing data",
    "Not Tracked",
  ],
  11: [
    "Product specifications",
    "Estimated lifetime usage",
    "Energy efficiency ratings",
    "Customer usage assumptions",
    "Not Tracked",
  ],
  12: [
    "Material composition data",
    "Recycling assumptions",
    "Disposal assumptions",
    "Product recovery data",
    "Not Tracked",
  ],
  13: [
    "Lease agreements",
    "Utility consumption",
    "Usage assumptions",
    "Customer operational data",
    "Not Tracked",
  ],
  14: [
    "Franchise operational data",
    "Energy consumption",
    "Utility bills",
    "Sales/activity data",
    "Not Tracked",
  ],
  15: [
    "Financial records",
    "Investment portfolio data",
    "ESG disclosures",
    "Not Tracked",
  ],
};

function CategoryExtraQuestions({
  categoryId,
  response,
  dispatch,
}: {
  categoryId: number;
  response: ReturnType<
    typeof useAssessment
  >["state"]["categoryResponses"][number];
  dispatch: ReturnType<typeof useAssessment>["dispatch"];
}) {
  const toggleSubItem = (item: string) => {
    const current = response?.selectedSubItems ?? [];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: { categoryId, data: { selectedSubItems: updated } },
    });
  };

  const selected = response?.selectedSubItems ?? [];

  if (categoryId === 4 || categoryId === 9) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader
          number="2"
          title="Which transportation modes are commonly used?"
        />
        <div className="flex flex-wrap gap-2">
          {TRANSPORT_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => toggleSubItem(mode)}
              className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${selected.includes(mode) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (categoryId === 5) {
    return (
      <>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
          <SectionHeader
            number="2"
            title="Which waste categories does your company generate?"
          />
          <div className="flex flex-wrap gap-2">
            {WASTE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleSubItem(cat)}
                className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${selected.includes(cat) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
          <SectionHeader number="3" title="Waste disposal tracking method" />
          <div className="flex flex-wrap gap-2">
            {WASTE_DISPOSAL.map((method) => (
              <button
                key={method}
                onClick={() => toggleSubItem(`disposal_${method}`)}
                className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${selected.includes(`disposal_${method}`) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (categoryId === 6) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader
          number="2"
          title="Which business travel modes are commonly used?"
        />
        <div className="flex flex-wrap gap-2">
          {TRAVEL_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => toggleSubItem(mode)}
              className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${selected.includes(mode) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (categoryId === 7) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader
          number="2"
          title="Which commuting methods are commonly used?"
        />
        <div className="flex flex-wrap gap-2">
          {COMMUTE_MODES.map((mode) => (
            <button
              key={mode}
              onClick={() => toggleSubItem(mode)}
              className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${selected.includes(mode) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (categoryId === 15) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader
          number="2"
          title="Does your company currently calculate financed emissions?"
        />
        <div className="flex gap-3 mt-2 flex-wrap">
          {["Yes", "No", "Planned for future"].map((opt) => (
            <button
              key={opt}
              onClick={() => toggleSubItem(`financed_${opt}`)}
              className={`px-4 py-2 rounded-xl border text-[12px] font-semibold transition-all ${selected.includes(`financed_${opt}`) ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

// GENERIC CATEGORY PANEL

function GenericCategoryPanel({ categoryId }: { categoryId: number }) {
  const { state, dispatch } = useAssessment();
  const response = state.categoryResponses[categoryId];
  const cat = SCOPE3_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return null;

  const monitoringOptions = (
    CAT_MONITORING[categoryId] ?? MONITORING_METHOD_OPTIONS.map((m) => m.label)
  ).map((m) => ({ id: m, label: m }));

  const dataSourceOptions = PRIMARY_DATA_SOURCES.map((s) => ({
    id: s,
    label: s,
  }));

  const toggleMethod = (id: string) => {
    const current = (response?.monitoringMethods ?? []) as string[];
    const updated = current.includes(id)
      ? current.filter((m) => m !== id)
      : [...current, id];
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: { categoryId, data: { monitoringMethods: updated as never[] } },
    });
  };

  const toggleSource = (id: string) => {
    const current = response?.primaryDataSources ?? [];
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    dispatch({
      type: "SET_CATEGORY_RESPONSE",
      payload: { categoryId, data: { primaryDataSources: updated } },
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="1" title="Category Overview" />
        <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
          {cat.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {cat.examples.map((ex) => (
            <span
              key={ex}
              className="text-[11px] text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1 rounded-full"
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      <CategoryExtraQuestions
        categoryId={categoryId}
        response={response}
        dispatch={dispatch}
      />

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="3" title="Data Monitoring Method" />
        <div className="flex flex-wrap gap-2">
          {monitoringOptions.map((opt) => {
            const isSelected = (
              (response?.monitoringMethods ?? []) as string[]
            ).includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggleMethod(opt.id)}
                className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${isSelected ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="4" title="Primary Data Sources" />
        <div className="flex flex-wrap gap-2">
          {dataSourceOptions.map((opt) => {
            const isSelected = (response?.primaryDataSources ?? []).includes(
              opt.id,
            );
            return (
              <button
                key={opt.id}
                onClick={() => toggleSource(opt.id)}
                className={`px-3 py-1.5 rounded-xl border text-[12px] font-medium transition-all ${isSelected ? "bg-[#0F5F4B] border-[#0F5F4B] text-white" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#1FA971]/40"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1 col mobile, 2 col sm+ */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-4">
        <SectionHeader number="5" title="Supporting Files" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UploadCard
            title="Activity Data"
            subTitle="CSV, XLS supported"
            accept=".csv,.xlsx"
          />
          <UploadCard
            title="Supporting Docs"
            subTitle="PDF, CSV supported"
            accept=".pdf,.csv"
          />
        </div>
      </div>
    </>
  );
}

// MAIN COMPONENT

export default function Step4_DataCollection() {
  const { goNext, goBack } = useNavigation();
  const { state, dispatch } = useAssessment();

  const applicableCategories = SCOPE3_CATEGORIES.filter(
    (c) =>
      state.categoryResponses[c.id]?.applicability ===
      ApplicabilityStatus.APPLICABLE,
  );

  const activeCatId =
    state.activeCategoryId ?? applicableCategories[0]?.id ?? 1;
  const setActiveCatId = (id: number) =>
    dispatch({ type: "SET_ACTIVE_CATEGORY", payload: id });

  return (
    <div className="w-full min-w-0">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0F5F4B] flex items-center justify-center shrink-0">
          <Database size={20} className="text-white" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-[#1FA971] uppercase tracking-widest mb-1">
            Step 4 of 6
          </div>
          <h2 className="text-[18px] sm:text-[22px] font-bold text-[#1D1F21] leading-tight">
            Data Collection
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[#6B7280] mt-1">
            Provide detailed information for each applicable category.
          </p>
        </div>
      </div>

      <MicroStepper
        steps={[
          { id: 1, label: "Categories" },
          { id: 2, label: "Suppliers" },
          { id: 3, label: "Methods" },
          { id: 4, label: "Files" },
        ]}
        current={
          state.purchasedGoods.suppliers.length > 0
            ? 3
            : state.purchasedGoods.selectedCategories.length > 0
              ? 2
              : 1
        }
      />

      {/* ── no applicable categories ── */}
      {applicableCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center shadow-sm mb-6">
          <BarChart3 size={36} className="text-[#E5E7EB] mx-auto mb-3" />
          <p className="text-[14px] font-semibold text-[#1D1F21] mb-1">
            No applicable categories
          </p>
          <p className="text-[13px] text-[#6B7280]">
            Go back to Step 3 and mark at least one category as applicable.
          </p>
        </div>
      ) : (
        <>
          <CategoryTabBar
            categories={applicableCategories}
            activeId={activeCatId}
            onSelect={setActiveCatId}
            responses={state.categoryResponses}
          />

          {activeCatId === 1 ? (
            <PurchasedGoodsPanel />
          ) : (
            <GenericCategoryPanel categoryId={activeCatId} />
          )}
        </>
      )}

      {/* ── Supplier Engagement ── */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            !
          </div>
          <span className="text-[13px] font-semibold text-[#1D1F21]">
            Supplier Engagement
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>
        <p className="text-[13px] text-[#6B7280] mb-4">
          Does your company engage suppliers for sustainability or emissions
          reporting?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {["Yes", "Partially", "No"].map((opt) => {
            const key = `supplier_engagement_${opt}`;
            const isSelected = (
              state.categoryResponses[1]?.selectedSubItems ?? []
            ).includes(key);
            return (
              <button
                key={opt}
                onClick={() => {
                  const current =
                    state.categoryResponses[1]?.selectedSubItems ?? [];
                  const cleaned = current.filter(
                    (i) => !i.startsWith("supplier_engagement_"),
                  );
                  const updated = isSelected ? cleaned : [...cleaned, key];
                  dispatch({
                    type: "SET_CATEGORY_RESPONSE",
                    payload: {
                      categoryId: 1,
                      data: { selectedSubItems: updated },
                    },
                  });
                }}
                className={`
                  flex-1 py-3 rounded-xl border-2 text-[13px] font-semibold transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#0F5F4B] bg-[#F3FBF7] text-[#0F5F4B]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#1FA971]/40 hover:bg-[#F9FAFB]"
                  }
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>
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
          Next: Data Availability
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

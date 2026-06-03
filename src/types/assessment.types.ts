export const ApplicabilityStatus = {
  APPLICABLE: "applicable",
  NOT_APPLICABLE: "not_applicable",
  POTENTIAL: "potential",
  PENDING: "pending",
} as const;
export type ApplicabilityStatus =
  (typeof ApplicabilityStatus)[keyof typeof ApplicabilityStatus];

export const DataAvailabilityStatus = {
  AVAILABLE: "available",
  PARTIALLY_AVAILABLE: "partially_available",
  NOT_AVAILABLE: "not_available",
  PLANNED: "planned_for_future",
} as const;
export type DataAvailabilityStatus =
  (typeof DataAvailabilityStatus)[keyof typeof DataAvailabilityStatus];

export const DataMonitoringMethod = {
  SPEND_BASED: "spend_based",
  QUANTITY_BASED: "quantity_based",
  BOTH: "both",
  NOT_TRACKED: "not_tracked",
} as const;
export type DataMonitoringMethod =
  (typeof DataMonitoringMethod)[keyof typeof DataMonitoringMethod];

export const OrgBoundary = {
  OPERATIONAL_CONTROL: "operational_control",
  FINANCIAL_CONTROL: "financial_control",
  EQUITY_SHARE: "equity_share",
  NOT_DEFINED: "not_defined",
} as const;
export type OrgBoundary = (typeof OrgBoundary)[keyof typeof OrgBoundary];

export const AssessmentStep = {
  WELCOME:               0,
  OPERATIONAL_SCREENING: 1,
  SCOPE3_CATEGORIES:     2,
  DATA_COLLECTION:       3,
  DATA_AVAILABILITY:     4,
  REVIEW_SUBMIT:         5,
} as const;
export type AssessmentStep = typeof AssessmentStep[keyof typeof AssessmentStep];

export interface CompanyProfile {
  name: string;
  industry: string;
  country: string;
  reportingYear: string;
  orgBoundary: OrgBoundary | null;
  employeeCount: string;
  hasSoldProducts: boolean | null;
  hasManufacturing: boolean | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCOPE 3 CATEGORY DEFINITION (static data shape)
// ─────────────────────────────────────────────────────────────────────────────

export interface Scope3CategoryDefinition {
  id: number;
  ghgCode: string;
  name: string;
  iconName: string; // lucide icon name string
  description: string;
  examples: string[];
  isUpstream: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLIER
// ─────────────────────────────────────────────────────────────────────────────

export type SupplierDataAvailability =
  | "available"
  | "partial"
  | "not_available";

export interface Supplier {
  id: string;
  name: string;
  type: string;
  country: string;
  annualSpend: string;
  dataAvailability: SupplierDataAvailability;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY-SPECIFIC DATA
// ─────────────────────────────────────────────────────────────────────────────

export interface PurchasedGoodsData {
  selectedCategories: string[];
  selectedItems: string[];
  suppliers: Supplier[];
}

export type TransportMode = "road" | "air" | "rail" | "marine" | "courier";

export interface TransportData {
  modes: TransportMode[];
}

export interface WasteData {
  segregated: "yes" | "partially" | "no" | null;
  categories: string[];
  disposalMethods: string[];
}

export interface BusinessTravelData {
  modes: string[];
}

export type WorkforceType = "onsite" | "hybrid" | "remote" | null;

export interface CommuteData {
  workforceType: WorkforceType;
  modes: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-CATEGORY RESPONSE (user answers)
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryResponse {
  categoryId: number;
  applicability: ApplicabilityStatus;
  monitoringMethods: DataMonitoringMethod[];
  dataAvailability: DataAvailabilityStatus;
  primaryDataSources: string[];
  selectedSubItems: string[];
  supplierEngagement: boolean | null;
  notes: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL ASSESSMENT STATE
// ─────────────────────────────────────────────────────────────────────────────

export interface AssessmentState {
  currentStep: number;
  completedSteps: number[];
  lastSaved: string | null;
  activeCategoryId: number | null;
  // Step 1
  companyProfile: CompanyProfile;

  // Step 3 — one entry per category (keyed by category id)
  categoryResponses: Record<number, CategoryResponse>;

  // Step 4 — detailed data per category type
  purchasedGoods: PurchasedGoodsData;
  transportUpstream: TransportData;
  transportDownstream: TransportData;
  wasteData: WasteData;
  travelData: BusinessTravelData;
  commuteData: CommuteData;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export type AssessmentAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "MARK_STEP_COMPLETE"; payload: number }
  | { type: "UPDATE_COMPANY"; payload: Partial<CompanyProfile> }
  | {
      type: "SET_CATEGORY_RESPONSE";
      payload: { categoryId: number; data: Partial<CategoryResponse> };
    }
  | { type: "UPDATE_PURCHASED_GOODS"; payload: Partial<PurchasedGoodsData> }
  | { type: "ADD_SUPPLIER"; payload: Supplier }
  | { type: "REMOVE_SUPPLIER"; payload: string }
  | { type: "UPDATE_TRANSPORT_UPSTREAM"; payload: Partial<TransportData> }
  | { type: "UPDATE_TRANSPORT_DOWNSTREAM"; payload: Partial<TransportData> }
  | { type: "UPDATE_WASTE"; payload: Partial<WasteData> }
  | { type: "UPDATE_TRAVEL"; payload: Partial<BusinessTravelData> }
  | { type: "UPDATE_COMMUTE"; payload: Partial<CommuteData> }
  | { type: "SAVE_PROGRESS" }
  | { type: "RESET_ASSESSMENT" }
  | { type: "SET_ACTIVE_CATEGORY"; payload: number | null };

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface AssessmentContextType {
  state: AssessmentState;
  dispatch: React.Dispatch<AssessmentAction>;
}

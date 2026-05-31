import { useReducer, useEffect, type ReactNode } from "react";
import type {
  AssessmentState,
  AssessmentAction,
  CategoryResponse,
} from "@/types/assessment.types";
import {
  AssessmentStep,
  ApplicabilityStatus,
  DataAvailabilityStatus,
} from "@/types/assessment.types";
import { AssessmentContext } from "@/context/AssessmentContextDef";

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT CATEGORY RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

const defaultCategoryResponse = (categoryId: number): CategoryResponse => ({
  categoryId,
  applicability: ApplicabilityStatus.PENDING,
  monitoringMethods: [],
  dataAvailability: DataAvailabilityStatus.NOT_AVAILABLE,
  primaryDataSources: [],
  selectedSubItems: [],
  supplierEngagement: null,
  notes: "",
});

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const initialCategoryResponses = Object.fromEntries(
  Array.from({ length: 15 }, (_, i) => [i + 1, defaultCategoryResponse(i + 1)]),
);

const INITIAL_STATE: AssessmentState = {
  currentStep: AssessmentStep.WELCOME,
  completedSteps: [],
  activeCategoryId: null,
lastSaved: null,
  companyProfile: {
    name: "",
    industry: "",
    country: "",
    reportingYear: new Date().getFullYear().toString(),
    orgBoundary: null,
    employeeCount: "",
    hasSoldProducts: null,
    hasManufacturing: null,
  },

  categoryResponses: initialCategoryResponses,

  purchasedGoods: {
    selectedCategories: [],
    selectedItems: [],
    suppliers: [],
  },

  transportUpstream: { modes: [] },
  transportDownstream: { modes: [] },

  wasteData: {
    segregated: null,
    categories: [],
    disposalMethods: [],
  },

  travelData: { modes: [] },
  commuteData: { workforceType: null, modes: [] },
};

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────

function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction,
): AssessmentState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };

    case "MARK_STEP_COMPLETE":
      if (state.completedSteps.includes(action.payload)) return state;
      return {
        ...state,
        completedSteps: [...state.completedSteps, action.payload],
      };

    case "UPDATE_COMPANY":
      return {
        ...state,
        companyProfile: { ...state.companyProfile, ...action.payload },
      };

    case "SET_CATEGORY_RESPONSE":
      return {
        ...state,
        categoryResponses: {
          ...state.categoryResponses,
          [action.payload.categoryId]: {
            ...state.categoryResponses[action.payload.categoryId],
            ...action.payload.data,
          },
        },
      };

    case "UPDATE_PURCHASED_GOODS":
      return {
        ...state,
        purchasedGoods: { ...state.purchasedGoods, ...action.payload },
      };

    case "ADD_SUPPLIER":
      return {
        ...state,
        purchasedGoods: {
          ...state.purchasedGoods,
          suppliers: [...state.purchasedGoods.suppliers, action.payload],
        },
      };

    case "REMOVE_SUPPLIER":
      return {
        ...state,
        purchasedGoods: {
          ...state.purchasedGoods,
          suppliers: state.purchasedGoods.suppliers.filter(
            (s) => s.id !== action.payload,
          ),
        },
      };

    case "UPDATE_TRANSPORT_UPSTREAM":
      return {
        ...state,
        transportUpstream: { ...state.transportUpstream, ...action.payload },
      };

    case "UPDATE_TRANSPORT_DOWNSTREAM":
      return {
        ...state,
        transportDownstream: {
          ...state.transportDownstream,
          ...action.payload,
        },
      };

    case "UPDATE_WASTE":
      return { ...state, wasteData: { ...state.wasteData, ...action.payload } };

    case "UPDATE_TRAVEL":
      return {
        ...state,
        travelData: { ...state.travelData, ...action.payload },
      };

    case "UPDATE_COMMUTE":
      return {
        ...state,
        commuteData: { ...state.commuteData, ...action.payload },
      };

    case "SET_ACTIVE_CATEGORY":
      return { ...state, activeCategoryId: action.payload };
      
    case "SAVE_PROGRESS":
      return { ...state, lastSaved: new Date().toISOString() };

    case "RESET_ASSESSMENT":
      localStorage.removeItem(STORAGE_KEY);
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "urimpact_scope3_assessment";

function loadFromStorage(): AssessmentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as AssessmentState;
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return INITIAL_STATE;
  }
}

function saveToStorage(state: AssessmentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn("Failed to persist assessment state.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    assessmentReducer,
    undefined,
    loadFromStorage,
  );

  // auto-save every time state changes
  useEffect(() => {
    saveToStorage(state);
    dispatch({ type: "SAVE_PROGRESS" });
  }, [
    state.currentStep,
    state.companyProfile,
    state.categoryResponses,
    state.purchasedGoods,
    state.wasteData,
    state.travelData,
    state.commuteData,
  ]);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
}

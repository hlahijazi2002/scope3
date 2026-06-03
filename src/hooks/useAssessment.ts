import { useContext } from "react";
import { AssessmentContext } from "@/context/AssessmentContextDef";
import { ApplicabilityStatus } from "@/types/assessment.types";
import type {
  AssessmentContextType,
  CategoryResponse,
  Supplier,
} from "@/types/assessment.types";

// ─────────────────────────────────────────────────────────────────────────────
// STEPS CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const FIRST_STEP = 0;
const LAST_STEP = 5;

// ─────────────────────────────────────────────────────────────────────────────
// BASE HOOK
// ─────────────────────────────────────────────────────────────────────────────

export function useAssessment(): AssessmentContextType {
  const ctx = useContext(AssessmentContext);
  if (!ctx)
    throw new Error("useAssessment must be used inside <AssessmentProvider>");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export function useNavigation() {
  const { state, dispatch } = useAssessment();

  const goToStep = (step: number) => {
    dispatch({ type: "MARK_STEP_COMPLETE", payload: state.currentStep });
    dispatch({ type: "SET_STEP", payload: step });
  };

  const goNext = () => goToStep(Math.min(state.currentStep + 1, LAST_STEP));
  const goBack = () =>
    dispatch({
      type: "SET_STEP",
      payload: Math.max(state.currentStep - 1, FIRST_STEP),
    });

  const isStepCompleted = (step: number) => state.completedSteps.includes(step);

  const progressPercent = Math.round((state.currentStep / LAST_STEP) * 100);

  return {
    currentStep: state.currentStep,
    goToStep,
    goNext,
    goBack,
    isStepCompleted,
    progressPercent,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPANY PROFILE
// ─────────────────────────────────────────────────────────────────────────────

export function useCompanyProfile() {
  const { state, dispatch } = useAssessment();

  const updateField = <K extends keyof typeof state.companyProfile>(
    field: K,
    value: (typeof state.companyProfile)[K],
  ) => {
    dispatch({ type: "UPDATE_COMPANY", payload: { [field]: value } });
  };

  const isProfileComplete = Boolean(
    state.companyProfile.name &&
    state.companyProfile.industry &&
    state.companyProfile.country &&
    state.companyProfile.orgBoundary,
  );

  return { profile: state.companyProfile, updateField, isProfileComplete };
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export function useCategoryResponse(categoryId: number) {
  const { state, dispatch } = useAssessment();
  const response = state.categoryResponses[categoryId];

  const update = (data: Partial<CategoryResponse>) =>
    dispatch({ type: "SET_CATEGORY_RESPONSE", payload: { categoryId, data } });

  const setApplicability = (value: CategoryResponse["applicability"]) =>
    update({ applicability: value });

  const toggleMonitoringMethod = (method: string) => {
    const current = response.monitoringMethods as string[];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    update({
      monitoringMethods: updated as CategoryResponse["monitoringMethods"],
    });
  };

  const toggleDataSource = (source: string) => {
    const current = response.primaryDataSources;
    const updated = current.includes(source)
      ? current.filter((s) => s !== source)
      : [...current, source];
    update({ primaryDataSources: updated });
  };

  const toggleSubItem = (item: string) => {
    const current = response.selectedSubItems;
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    update({ selectedSubItems: updated });
  };

  return {
    response,
    update,
    setApplicability,
    toggleMonitoringMethod,
    toggleDataSource,
    toggleSubItem,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASED GOODS
// ─────────────────────────────────────────────────────────────────────────────

export function usePurchasedGoods() {
  const { state, dispatch } = useAssessment();
  const { purchasedGoods } = state;

  const toggleCategory = (category: string) => {
    const updated = purchasedGoods.selectedCategories.includes(category)
      ? purchasedGoods.selectedCategories.filter((c) => c !== category)
      : [...purchasedGoods.selectedCategories, category];
    dispatch({
      type: "UPDATE_PURCHASED_GOODS",
      payload: { selectedCategories: updated },
    });
  };

  const toggleItem = (item: string) => {
    const updated = purchasedGoods.selectedItems.includes(item)
      ? purchasedGoods.selectedItems.filter((i) => i !== item)
      : [...purchasedGoods.selectedItems, item];
    dispatch({
      type: "UPDATE_PURCHASED_GOODS",
      payload: { selectedItems: updated },
    });
  };

  const addSupplier = (supplier: Supplier) =>
    dispatch({ type: "ADD_SUPPLIER", payload: supplier });
  const removeSupplier = (id: string) =>
    dispatch({ type: "REMOVE_SUPPLIER", payload: id });

  return {
    purchasedGoods,
    toggleCategory,
    toggleItem,
    addSupplier,
    removeSupplier,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

export function useAssessmentSummary() {
  const { state } = useAssessment();
  const responses = Object.values(state.categoryResponses);

  const applicable = responses.filter(
    (r) => r.applicability === ApplicabilityStatus.APPLICABLE,
  );
  const notApplicable = responses.filter(
    (r) => r.applicability === ApplicabilityStatus.NOT_APPLICABLE,
  );
  const potential = responses.filter(
    (r) => r.applicability === ApplicabilityStatus.POTENTIAL,
  );
  const pending = responses.filter(
    (r) => r.applicability === ApplicabilityStatus.PENDING,
  );

  const readinessPercent =
    applicable.length === 0
      ? 0
      : Math.round(
          (applicable.filter(
            (r) =>
              r.dataAvailability === "available" ||
              r.dataAvailability === "partially_available",
          ).length /
            applicable.length) *
            100,
        );

  return {
    applicable,
    notApplicable,
    potential,
    pending,
    totalApplicable: applicable.length,
    totalCategories: responses.length,
    readinessPercent,
    lastSaved: state.lastSaved,
  };
}

import { createContext } from "react";
import type { AssessmentContextType } from "@/types/assessment.types";

export const AssessmentContext = createContext<AssessmentContextType | null>(
  null,
);

import { AssessmentProvider } from "@/context/AssessmentContext";
import { useAssessment } from "@/hooks/useAssessment";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import WelcomeScreen from "@/components/steps/WelcomeScreen";
import Step1_CompanyProfile from "@/components/steps/Step1_CompanyProfile";
import Step2_OperationalScreening from "@/components/steps/Step2_OperationalScreening";
import Step3_Scope3Categories from "@/components/steps/Step3_Scope3Categories";
import Step4_DataCollection from "@/components/steps/Step4_DataCollection";
import Step5_DataAvailability from "@/components/steps/Step5_DataAvailability";
import Step6_ReviewSubmit from "@/components/steps/Step6_ReviewSubmit";
import AIAssistant from "@/components/ui/AIAssistant";
import { useState, useEffect, useRef } from "react";

// STEP RENDERER

const STEPS: Record<number, React.ReactNode> = {
  1: <Step1_CompanyProfile />,
  2: <Step2_OperationalScreening />,
  3: <Step3_Scope3Categories />,
  4: <Step4_DataCollection />,
  5: <Step5_DataAvailability />,
  6: <Step6_ReviewSubmit />,
};

// INNER APP

function AppInner() {
  const { state } = useAssessment();
  const step = state.currentStep;
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState(step);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayed(step);
      setVisible(true);
      mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
    return () => clearTimeout(t);
  }, [step]);

  if (displayed === 0)
    return (
      <div
        className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <WelcomeScreen />
        <AIAssistant />
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] font-['Poppins'] overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <div
            className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            {STEPS[displayed] ?? null}
          </div>
        </main>
        <RightPanel />
      </div>
      <AIAssistant />
    </div>
  );
}

// ROOT

export default function App() {
  return (
    <AssessmentProvider>
      <AppInner />
    </AssessmentProvider>
  );
}

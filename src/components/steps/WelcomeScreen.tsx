import { Leaf, ArrowRight, Shield, Clock, Zap, Users } from "lucide-react";
import { useNavigation } from "@/hooks/useAssessment";

// DATA

const STATS = [
  { value: "15", label: "GHG Categories" },
  { value: "25m", label: "Avg. Completion" },
  { value: "100%", label: "GHG Protocol" },
];

const FEATURES = [
  { icon: <Zap size={14} />, text: "AI-powered category recommendations" },
  { icon: <Shield size={14} />, text: "Auto-saved — resume anytime" },
  { icon: <Users size={14} />, text: "Multi-user collaboration supported" },
  { icon: <Clock size={14} />, text: "Structured across 6 guided steps" },
];

// COMPONENT

export default function WelcomeScreen() {
  const { goToStep } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Poppins']">
      {/* ── LEFT — dark panel ── */}
      <div className="lg:w-[42%] bg-[#0F5F4B] flex flex-col justify-between p-8 sm:p-10 lg:p-12 relative overflow-hidden min-h-[280px] lg:min-h-screen">
        {/* texture circles */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-white/10 -top-40 -left-40 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10 bottom-20 -right-20 pointer-events-none" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-[#1FA971]/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        {/* logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-[16px] tracking-[0.12em]">
            URIMPACT
          </span>
        </div>

        {/* center content */}
        <div className="relative z-10 mt-8 lg:mt-0">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 mb-4 lg:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1FA971]" />
            <span className="text-white/80 text-[11px] font-medium tracking-widest uppercase">
              GHG Protocol Aligned
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-white leading-[1.15] mb-3 lg:mb-4">
            Scope 3<br />
            <span className="text-[#1FA971]">Applicability</span>
            <br />
            Assessment
          </h1>

          <p className="text-white/60 text-[13px] lg:text-[14px] leading-relaxed mb-6 lg:mb-10 max-w-[320px]">
            Identify which of the 15 GHG Protocol Scope 3 categories apply to
            your organization's value chain.
          </p>

          {/* stats */}
          <div className="flex gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-[22px] lg:text-[26px] font-bold text-white">
                  {s.value}
                </div>
                <div className="text-[11px] text-white/50 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom */}
        <div className="text-white/30 text-[11px] relative z-10 mt-8 lg:mt-0">
          © {new Date().getFullYear()} URIMPACT Platform
        </div>
      </div>

      {/* ── RIGHT — content panel ── */}
      <div className="flex-1 bg-[#F9FAFB] flex items-center justify-center p-6 sm:p-8 lg:p-14">
        <div className="w-full max-w-[440px]">
          <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold text-[#1D1F21] leading-tight mb-2">
            Ready to map your
            <br />
            emissions footprint?
          </h2>
          <p className="text-[13px] lg:text-[14px] text-[#6B7280] leading-relaxed mb-6 lg:mb-8">
            This guided assessment takes ~25 minutes and helps you determine
            which Scope 3 categories are material to your organization.
          </p>

          {/* features list */}
          <div className="space-y-2.5 lg:space-y-3 mb-6 lg:mb-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#F3FBF7] border border-[#E5E7EB] flex items-center justify-center text-[#0F5F4B] shrink-0">
                  {f.icon}
                </div>
                <span className="text-[13px] text-[#1D1F21] font-medium">
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* divider */}
          <div className="h-px bg-[#E5E7EB] mb-6 lg:mb-8" />

          {/* CTAs */}
          <div className="space-y-3">
            <button
              onClick={() => goToStep(1)}
              className="w-full flex items-center justify-between px-5 py-3.5 lg:py-4 bg-[#0F5F4B] hover:bg-[#0a4a39] text-white rounded-xl font-semibold text-[14px] transition-all duration-200 hover:shadow-lg group"
            >
              <span>Start New Assessment</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => goToStep(1)}
              className="w-full flex items-center justify-between px-5 py-3.5 lg:py-4 bg-white hover:bg-[#F3FBF7] text-[#0F5F4B] border border-[#E5E7EB] hover:border-[#1FA971] rounded-xl font-medium text-[14px] transition-all duration-200 group"
            >
              <span>Continue Saved Draft</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <p className="text-center text-[11px] text-[#6B7280] mt-6">
            Your progress is automatically saved at every step.
          </p>
        </div>
      </div>
    </div>
  );
}

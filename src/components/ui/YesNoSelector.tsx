import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// TYPES

type YesNoValue = "yes" | "no" | "na" | null;

interface YesNoOption {
  value: YesNoValue;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
  colors: {
    border: string;
    background: string;
    text: string;
    iconColor: string;
  };
}

interface YesNoSelectorProps {
  value: YesNoValue;
  onChange: (value: YesNoValue) => void;
  showNA?: boolean;
  naLabel?: string;
}

// OPTIONS

const OPTIONS: YesNoOption[] = [
  {
    value: "yes",
    label: "Yes",
    subLabel: "This applies to our organization",
    icon: <CheckCircle2 size={28} />,
    colors: {
      border: "border-[#1FA971]",
      background: "bg-[#F3FBF7]",
      text: "text-[#0F5F4B]",
      iconColor: "text-[#1FA971]",
    },
  },
  {
    value: "no",
    label: "No",
    subLabel: "This does not apply to us",
    icon: <XCircle size={28} />,
    colors: {
      border: "border-red-400",
      background: "bg-red-50",
      text: "text-red-700",
      iconColor: "text-red-400",
    },
  },
  {
    value: "na",
    label: "Not Applicable",
    subLabel: "This activity doesn't exist in our value chain",
    icon: <AlertCircle size={28} />,
    colors: {
      border: "border-gray-400",
      background: "bg-gray-50",
      text: "text-gray-600",
      iconColor: "text-gray-400",
    },
  },
];

// COMPONENT

export default function YesNoSelector({
  value,
  onChange,
  showNA = false,
  naLabel,
}: YesNoSelectorProps) {
  const options = showNA ? OPTIONS : OPTIONS.filter((o) => o.value !== "na");

  // override NA label if provided
  const resolvedOptions = naLabel
    ? options.map((o) => (o.value === "na" ? { ...o, label: naLabel } : o))
    : options;

  return (
    <div
      className={`grid gap-3 mt-4 ${showNA ? "grid-cols-3" : "grid-cols-2"}`}
    >
      {resolvedOptions.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative p-5 rounded-xl border-2 text-left
              transition-all duration-200 cursor-pointer
              hover:-translate-y-0.5 hover:shadow-md
              ${
                isSelected
                  ? `${option.colors.border} ${option.colors.background} shadow-md`
                  : "border-[#E5E7EB] bg-white hover:border-[#1FA971] hover:bg-[#F3FBF7]"
              }
            `}
          >
            {/* selected indicator */}
            {isSelected && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#0F5F4B] flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
              </span>
            )}

            {/* icon */}
            <div
              className={`mb-2 ${isSelected ? option.colors.iconColor : "text-[#6B7280]"}`}
            >
              {option.icon}
            </div>

            {/* label */}
            <div
              className={`text-[15px] font-semibold mb-1 ${isSelected ? option.colors.text : "text-[#1D1F21]"}`}
            >
              {option.label}
            </div>

            {/* sub label */}
            <div className="text-[11px] text-[#6B7280] leading-relaxed">
              {option.subLabel}
            </div>
          </button>
        );
      })}
    </div>
  );
}

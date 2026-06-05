// TYPES

type TrafficValue = "available" | "partial" | "not_available";

interface TrafficOption {
  value: TrafficValue;
  label: string;
  subLabel: string;
  dot: string;
  border: string;
  bg: string;
  text: string;
  ring: string;
}

interface TrafficLightProps {
  value: TrafficValue | null;
  onChange: (value: TrafficValue) => void;
}

// OPTIONS

const OPTIONS: TrafficOption[] = [
  {
    value: "available",
    label: "Available",
    subLabel: "Data is ready to use",
    dot: "bg-green-500",
    border: "border-green-300",
    bg: "bg-green-50",
    text: "text-green-800",
    ring: "ring-green-200",
  },
  {
    value: "partial",
    label: "Partial",
    subLabel: "Some data available",
    dot: "bg-amber-400",
    border: "border-amber-300",
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
  },
  {
    value: "not_available",
    label: "Not Available",
    subLabel: "No data at this time",
    dot: "bg-red-400",
    border: "border-red-300",
    bg: "bg-red-50",
    text: "text-red-800",
    ring: "ring-red-200",
  },
];

// COMPONENT

export default function TrafficLight({ value, onChange }: TrafficLightProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-3">
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              p-3 rounded-xl border-2 text-center
              transition-all duration-200 cursor-pointer
              hover:-translate-y-0.5 hover:shadow-md
              ${
                isSelected
                  ? `${option.border} ${option.bg} ring-4 ${option.ring} shadow-md`
                  : "border-[#E5E7EB] bg-white hover:shadow-sm"
              }
            `}
          >
            {/* dot */}
            <div
              className={`w-5 h-5 rounded-full mx-auto mb-2 ${option.dot}`}
            />

            {/* label */}
            <div
              className={`text-[12px] font-semibold ${isSelected ? option.text : "text-[#1D1F21]"}`}
            >
              {option.label}
            </div>

            {/* sub label */}
            <div className="text-[10px] text-[#6B7280] mt-1 leading-snug">
              {option.subLabel}
            </div>
          </button>
        );
      })}
    </div>
  );
}

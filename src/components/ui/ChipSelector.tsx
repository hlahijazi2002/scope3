import { Check } from "lucide-react";

// TYPES

interface ChipOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
}

// COMPONENT

export default function ChipSelector({
  options,
  selected,
  onChange,
  multiSelect = true,
}: ChipSelectorProps) {
  const toggle = (id: string) => {
    if (multiSelect) {
      const updated = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id];
      onChange(updated);
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => toggle(option.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-full
              border-[1.5px] text-[12px] font-medium
              transition-all duration-200 cursor-pointer
              ${
                isSelected
                  ? "border-[#0F5F4B] bg-[#0F5F4B] text-white shadow-sm"
                  : "border-[#E5E7EB] bg-white text-[#1D1F21] hover:border-[#1FA971] hover:bg-[#F3FBF7]"
              }
            `}
          >
            {/* icon */}
            {option.icon && (
              <span className={isSelected ? "text-white" : "text-[#6B7280]"}>
                {option.icon}
              </span>
            )}

            {option.label}

            {/* check indicator */}
            {isSelected && <Check size={12} className="text-white" />}
          </button>
        );
      })}
    </div>
  );
}

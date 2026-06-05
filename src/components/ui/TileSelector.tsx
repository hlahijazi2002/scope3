import { Check } from "lucide-react";

// TYPES

interface TileOption {
  id: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

interface TileSelectorProps {
  options: TileOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  columns?: 2 | 3 | 4;
}

// COMPONENT

export default function TileSelector({
  options,
  selected,
  onChange,
  multiSelect = true,
  columns = 3,
}: TileSelectorProps) {
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

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-3 mt-4`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => toggle(option.id)}
            className={`
              relative p-4 rounded-xl border-[1.5px] text-left
              transition-all duration-200 cursor-pointer
              hover:-translate-y-0.5 hover:shadow-md
              ${
                isSelected
                  ? "border-[#0F5F4B] bg-[#F3FBF7] shadow-sm"
                  : "border-[#E5E7EB] bg-white hover:border-[#1FA971] hover:bg-[#F3FBF7]"
              }
            `}
          >
            {/* check badge */}
            {isSelected && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0F5F4B] flex items-center justify-center">
                <Check size={11} className="text-white" />
              </span>
            )}

            {/* icon */}
            {option.icon && (
              <div
                className={`text-2xl mb-2 ${isSelected ? "text-[#0F5F4B]" : "text-[#6B7280]"}`}
              >
                {option.icon}
              </div>
            )}

            {/* label */}
            <div
              className={`text-[12px] font-semibold leading-snug ${isSelected ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}
            >
              {option.label}
            </div>

            {/* sub label */}
            {option.subLabel && (
              <div className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                {option.subLabel}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

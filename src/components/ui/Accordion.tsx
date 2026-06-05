import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// TYPES

interface AccordionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  selectedCounts?: Record<string, number>;
  defaultOpen?: string[];
}

// SINGLE ACCORDION PANEL

function AccordionPanel({
  item,
  isOpen,
  onToggle,
  selectedCount = 0,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount?: number;
}) {
  return (
    <div
      className={`
        border-[1.5px] rounded-xl overflow-hidden mb-2
        transition-all duration-200
        ${isOpen ? "border-[#1FA971] shadow-sm" : "border-[#E5E7EB]"}
      `}
    >
      {/* ── Header ── */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 px-4 py-3 text-left
          transition-colors duration-200
          ${isOpen ? "bg-[#F3FBF7]" : "bg-white hover:bg-[#F9FAFB]"}
        `}
      >
        {/* icon */}
        {item.icon && (
          <span
            className={`text-lg shrink-0 ${isOpen ? "text-[#0F5F4B]" : "text-[#6B7280]"}`}
          >
            {item.icon}
          </span>
        )}

        {/* label */}
        <span
          className={`flex-1 text-[13px] font-semibold ${isOpen ? "text-[#0F5F4B]" : "text-[#1D1F21]"}`}
        >
          {item.label}
        </span>

        {/* selected count badge */}
        {selectedCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F5F4B] text-white text-[10px] font-semibold">
            <Check size={9} />
            {selectedCount}
          </span>
        )}

        {/* chevron */}
        <ChevronDown
          size={16}
          className={`
            text-[#6B7280] transition-transform duration-200 shrink-0
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* ── Body ── */}
      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? "max-h-150 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB]">
          {item.children}
        </div>
      </div>
    </div>
  );
}

// MAIN COMPONENT

export default function Accordion({
  items,
  selectedCounts = {},
  defaultOpen = [],
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="mt-4">
      {items.map((item) => (
        <AccordionPanel
          key={item.id}
          item={item}
          isOpen={openIds.includes(item.id)}
          onToggle={() => toggle(item.id)}
          selectedCount={selectedCounts[item.id] ?? 0}
        />
      ))}
    </div>
  );
}

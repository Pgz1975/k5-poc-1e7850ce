import { useState, useEffect, ReactNode } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleDashboardSectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  description?: string;
  summaryContent: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  colorClass?: string;
  borderColorClass?: string;
  iconBgClass?: string;
}

export const CollapsibleDashboardSection = ({
  id,
  title,
  icon: Icon,
  description,
  summaryContent,
  children,
  defaultOpen = false,
  colorClass = "text-primary",
  borderColorClass = "border-primary/20",
  iconBgClass = "bg-primary/10",
}: CollapsibleDashboardSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Persist state to localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`dashboard-section-${id}`);
    if (stored !== null) {
      setIsOpen(stored === "true");
    }
  }, [id]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(`dashboard-section-${id}`, String(newState));
  };

  return (
    <div className={cn("rounded-3xl border-4 bg-white overflow-hidden transition-all", borderColorClass)}>
      {/* Header - Always Visible */}
      <button
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group"
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center gap-4">
          <div className={cn("rounded-2xl p-4 border-3", iconBgClass, borderColorClass)}>
            <Icon className={cn("w-8 h-8", colorClass)} />
          </div>
          <div className="text-left">
            <h2 className={cn("text-2xl md:text-3xl font-black", colorClass)}>{title}</h2>
            {description && (
              <p className="text-sm text-gray-600 font-medium mt-1">{description}</p>
            )}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-8 h-8 transition-transform duration-300",
            colorClass,
            isOpen ? "rotate-180" : "",
            "group-hover:scale-110"
          )}
        />
      </button>

      {/* Summary - Visible When Collapsed */}
      {!isOpen && (
        <div className="px-6 pb-6 border-t-2 border-dashed border-gray-200">
          <div className="pt-4">{summaryContent}</div>
        </div>
      )}

      {/* Full Content - Visible When Expanded */}
      {isOpen && (
        <div
          id={`section-${id}`}
          className="px-6 pb-6 space-y-6 border-t-2 border-gray-200 animate-accordion-down"
        >
          {children}
        </div>
      )}
    </div>
  );
};

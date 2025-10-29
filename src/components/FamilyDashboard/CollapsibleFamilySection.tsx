import { ReactNode, useState, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleFamilySectionProps {
  id: string;
  title: string;
  icon: LucideIcon;
  description?: string;
  summaryContent: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  colorClass?: string; // e.g., "pink", "cyan", "purple", "lime"
}

const colorStyles = {
  pink: {
    border: "border-pink-200",
    bg: "bg-gradient-to-br from-pink-50 to-pink-100/50",
    icon: "bg-pink-400 text-white",
    hover: "hover:border-pink-300",
  },
  cyan: {
    border: "border-cyan-200",
    bg: "bg-gradient-to-br from-cyan-50 to-cyan-100/50",
    icon: "bg-cyan-400 text-white",
    hover: "hover:border-cyan-300",
  },
  purple: {
    border: "border-purple-200",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100/50",
    icon: "bg-purple-400 text-white",
    hover: "hover:border-purple-300",
  },
  lime: {
    border: "border-lime-200",
    bg: "bg-gradient-to-br from-lime-50 to-lime-100/50",
    icon: "bg-lime-400 text-white",
    hover: "hover:border-lime-300",
  },
  blue: {
    border: "border-blue-200",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
    icon: "bg-blue-400 text-white",
    hover: "hover:border-blue-300",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
    icon: "bg-orange-400 text-white",
    hover: "hover:border-orange-300",
  },
};

export function CollapsibleFamilySection({
  id,
  title,
  icon: Icon,
  description,
  summaryContent,
  children,
  defaultOpen = false,
  colorClass = "blue",
}: CollapsibleFamilySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Load state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`family-dashboard-section-${id}`);
    if (stored !== null) {
      setIsOpen(stored === "true");
    }
  }, [id]);

  // Save state to localStorage
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem(`family-dashboard-section-${id}`, String(newState));
  };

  const colors = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue;

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle}>
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200",
          colors.border,
          isOpen ? "border-2" : "border-2",
          !isOpen && colors.hover
        )}
      >
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              "p-6 cursor-pointer transition-all",
              !isOpen && colors.bg
            )}
          >
            <div className="flex items-center justify-between gap-4">
              {/* Icon and Title */}
              <div className="flex items-center gap-4">
                <div className={cn("rounded-xl p-3", colors.icon)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-bold">{title}</h2>
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              </div>

              {/* Summary Content (when collapsed) */}
              {!isOpen && (
                <div className="flex items-center gap-6 flex-1 justify-end">
                  <div className="text-right">{summaryContent}</div>
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              )}

              {/* Chevron (when expanded) */}
              {isOpen && (
                <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 transition-transform rotate-180" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 pt-2">
            {children}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

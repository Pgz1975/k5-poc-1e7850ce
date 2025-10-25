import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface CoquiVoicePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const CoquiVoicePanel = ({ isOpen, onClose, children }: CoquiVoicePanelProps) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />

          {/* Side panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary-glow/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐸</span>
                <h2 className="text-lg font-semibold">
                  {t("Asistente Coquí", "Coquí Assistant")}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-primary/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

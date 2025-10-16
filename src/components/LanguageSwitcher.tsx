import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

type Language = "es" | "en";

export const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<Language>("es");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "es" ? "en" : "es"));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 hover:bg-primary/10"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === "es" ? "ES" : "EN"}</span>
    </Button>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Filter, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface FilterState {
  skill: string | null;
  language: string | null;
  readingLevel: string | null;
  riskLevel: string | null;
  dateRange: { from: Date | null; to: Date | null };
  deviceType: string | null;
  category: string | null;
}

interface AdvancedFilterDrawerProps {
  onFilterChange?: (filters: FilterState) => void;
}

export const AdvancedFilterDrawer = ({ onFilterChange }: AdvancedFilterDrawerProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    skill: null,
    language: null,
    readingLevel: null,
    riskLevel: null,
    dateRange: { from: null, to: null },
    deviceType: null,
    category: null,
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      skill: null,
      language: null,
      readingLevel: null,
      riskLevel: null,
      dateRange: { from: null, to: null },
      deviceType: null,
      category: null,
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.skill) count++;
    if (filters.language) count++;
    if (filters.readingLevel) count++;
    if (filters.riskLevel) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.deviceType) count++;
    if (filters.category) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          {t("Filtros", "Filters")}
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-purple-500 text-white">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("Filtros Avanzados", "Advanced Filters")}</SheetTitle>
          <SheetDescription>
            {t("Filtra los datos del panel según múltiples criterios", "Filter dashboard data by multiple criteria")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Skill Filter */}
          <div className="space-y-2">
            <Label>{t("Habilidad", "Skill")}</Label>
            <Select value={filters.skill || ""} onValueChange={(value) => updateFilter("skill", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Todas las habilidades", "All skills")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Todas", "All")}</SelectItem>
                <SelectItem value="comprehension">{t("Comprensión", "Comprehension")}</SelectItem>
                <SelectItem value="fluency">{t("Fluidez", "Fluency")}</SelectItem>
                <SelectItem value="vocabulary">{t("Vocabulario", "Vocabulary")}</SelectItem>
                <SelectItem value="pronunciation">{t("Pronunciación", "Pronunciation")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <Label>{t("Idioma", "Language")}</Label>
            <Select value={filters.language || ""} onValueChange={(value) => updateFilter("language", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Ambos idiomas", "Both languages")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Ambos", "Both")}</SelectItem>
                <SelectItem value="spanish">{t("Español", "Spanish")}</SelectItem>
                <SelectItem value="english">{t("Inglés", "English")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reading Level Filter */}
          <div className="space-y-2">
            <Label>{t("Nivel de Lectura", "Reading Level")}</Label>
            <Select value={filters.readingLevel || ""} onValueChange={(value) => updateFilter("readingLevel", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Todos los niveles", "All levels")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Todos", "All")}</SelectItem>
                <SelectItem value="k">{t("Kindergarten", "Kindergarten")}</SelectItem>
                <SelectItem value="1">{t("1er Grado", "1st Grade")}</SelectItem>
                <SelectItem value="2">{t("2do Grado", "2nd Grade")}</SelectItem>
                <SelectItem value="3">{t("3er Grado", "3rd Grade")}</SelectItem>
                <SelectItem value="4">{t("4to Grado", "4th Grade")}</SelectItem>
                <SelectItem value="5">{t("5to Grado", "5th Grade")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-2">
            <Label>{t("Nivel de Riesgo", "Risk Level")}</Label>
            <Select value={filters.riskLevel || ""} onValueChange={(value) => updateFilter("riskLevel", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Todos los niveles", "All levels")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Todos", "All")}</SelectItem>
                <SelectItem value="low">{t("Bajo", "Low")}</SelectItem>
                <SelectItem value="medium">{t("Medio", "Medium")}</SelectItem>
                <SelectItem value="high">{t("Alto", "High")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device Type Filter */}
          <div className="space-y-2">
            <Label>{t("Tipo de Dispositivo", "Device Type")}</Label>
            <Select value={filters.deviceType || ""} onValueChange={(value) => updateFilter("deviceType", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Todos los dispositivos", "All devices")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Todos", "All")}</SelectItem>
                <SelectItem value="mobile">{t("Teléfono", "Mobile")}</SelectItem>
                <SelectItem value="tablet">{t("Tableta", "Tablet")}</SelectItem>
                <SelectItem value="computer">{t("Computadora", "Computer")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reading Category Filter */}
          <div className="space-y-2">
            <Label>{t("Categoría de Lectura", "Reading Category")}</Label>
            <Select value={filters.category || ""} onValueChange={(value) => updateFilter("category", value || null)}>
              <SelectTrigger>
                <SelectValue placeholder={t("Todas las categorías", "All categories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("Todas", "All")}</SelectItem>
                <SelectItem value="science">{t("Ciencia", "Science")}</SelectItem>
                <SelectItem value="fiction">{t("Ficción", "Fiction")}</SelectItem>
                <SelectItem value="history">{t("Historia", "History")}</SelectItem>
                <SelectItem value="math">{t("Matemáticas", "Math")}</SelectItem>
                <SelectItem value="culture">{t("Cultura PR", "PR Culture")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label>{t("Rango de Fechas", "Date Range")}</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !filters.dateRange.from && "text-muted-foreground")}>
                    {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : t("Desde", "From")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, from: date || null })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !filters.dateRange.to && "text-muted-foreground")}>
                    {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : t("Hasta", "To")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => updateFilter("dateRange", { ...filters.dateRange, to: date || null })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 gap-2" onClick={clearAllFilters}>
              <X className="h-4 w-4" />
              {t("Limpiar Filtros", "Clear Filters")}
            </Button>
            <Button className="flex-1" onClick={() => setOpen(false)}>
              {t("Aplicar", "Apply")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

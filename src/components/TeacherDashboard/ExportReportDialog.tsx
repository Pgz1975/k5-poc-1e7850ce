import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

type ExportFormat = "excel" | "pdf";
type ExportScope = "all" | "selected" | "dateRange";

export const ExportReportDialog = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [scope, setScope] = useState<ExportScope>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [includeCharts, setIncludeCharts] = useState(true);
  const [bilingualHeaders, setBilingualHeaders] = useState(true);

  const handleExport = () => {
    // Mock export functionality
    const exportName = exportFormat === "excel" ? "reporte_clase.xlsx" : "reporte_clase.pdf";
    
    toast({
      title: t("Reporte Generado", "Report Generated"),
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-lime-500" />
          <span>
            {t(
              `Descargando ${exportName}...`,
              `Downloading ${exportName}...`
            )}
          </span>
        </div>
      ),
    });

    // In a real implementation, this would trigger file download
    console.log("Export settings:", {
      format: exportFormat,
      scope,
      dateRange,
      includeCharts,
      bilingualHeaders,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          {t("Exportar Reporte", "Export Report")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("Exportar Reporte", "Export Report")}</DialogTitle>
          <DialogDescription>
            {t("Configura las opciones de exportación para tu reporte", "Configure export options for your report")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>{t("Formato", "Format")}</Label>
            <RadioGroup value={exportFormat} onValueChange={(value: string) => setExportFormat(value as ExportFormat)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                <RadioGroupItem value="excel" id="excel" />
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <Label htmlFor="excel" className="flex-1 cursor-pointer">
                  <div className="font-semibold">Excel (.xlsx)</div>
                  <div className="text-sm text-muted-foreground">
                    {t("Ideal para análisis de datos", "Ideal for data analysis")}
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                <RadioGroupItem value="pdf" id="pdf" />
                <FileText className="h-5 w-5 text-red-600" />
                <Label htmlFor="pdf" className="flex-1 cursor-pointer">
                  <div className="font-semibold">PDF</div>
                  <div className="text-sm text-muted-foreground">
                    {t("Reporte profesional con gráficos", "Professional report with charts")}
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Scope Selection */}
          <div className="space-y-3">
            <Label>{t("Alcance", "Scope")}</Label>
            <RadioGroup value={scope} onValueChange={(value: string) => setScope(value as ExportScope)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">
                  {t("Toda la clase", "Entire class")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="cursor-pointer">
                  {t("Estudiantes seleccionados (0)", "Selected students (0)")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dateRange" id="dateRange" />
                <Label htmlFor="dateRange" className="cursor-pointer">
                  {t("Rango de fechas", "Date range")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range (shown if scope is dateRange) */}
          {scope === "dateRange" && (
            <div className="space-y-2 pl-6">
              <Label className="text-sm">{t("Selecciona el período", "Select period")}</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                      {dateRange.from ? formatDate(dateRange.from, "PPP") : <span>{t("Desde", "From")}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from || undefined}
                      onSelect={(date) => setDateRange({ ...dateRange, from: date || null })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}>
                      {dateRange.to ? formatDate(dateRange.to, "PPP") : <span>{t("Hasta", "To")}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to || undefined}
                      onSelect={(date) => setDateRange({ ...dateRange, to: date || null })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            <Label>{t("Opciones", "Options")}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                />
                <Label htmlFor="charts" className="cursor-pointer text-sm">
                  {t("Incluir gráficos y visualizaciones", "Include charts and visualizations")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bilingual"
                  checked={bilingualHeaders}
                  onCheckedChange={(checked) => setBilingualHeaders(checked as boolean)}
                />
                <Label htmlFor="bilingual" className="cursor-pointer text-sm">
                  {t("Encabezados bilingües (ES/EN)", "Bilingual headers (ES/EN)")}
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              {t("Cancelar", "Cancel")}
            </Button>
            <Button className="flex-1 gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              {t("Exportar", "Export")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

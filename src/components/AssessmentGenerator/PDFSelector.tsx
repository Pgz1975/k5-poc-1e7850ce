import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PDFSelectorProps {
  documents: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PDFSelector({ documents, selectedId, onSelect }: PDFSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <label className="block text-lg font-semibold mb-3">
        {t('Selecciona un PDF:', 'Select a PDF:')}
      </label>
      <Select value={selectedId || undefined} onValueChange={onSelect}>
        <SelectTrigger className="w-full text-lg p-6 border-2 border-primary/20">
          <SelectValue placeholder={t('Elige un documento...', 'Choose a document...')} />
        </SelectTrigger>
        <SelectContent>
          {documents.map((doc) => (
            <SelectItem key={doc.id} value={doc.id} className="text-lg py-3">
              {doc.original_filename} {doc.page_count ? `- ${doc.page_count} ${t('páginas', 'pages')}` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

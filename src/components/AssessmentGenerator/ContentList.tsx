import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContentItem } from "./ContentItem";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContentListProps {
  documentId: string;
  onSelectionChange: (selected: SelectedItems) => void;
}

interface SelectedItems {
  texts: string[];
  images: string[];
  questions: string[];
}

export function ContentList({ documentId, onSelectionChange }: ContentListProps) {
  const { t } = useLanguage();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<SelectedItems>({
    texts: [],
    images: [],
    questions: []
  });

  useEffect(() => {
    fetchContent();
  }, [documentId]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-pdf-content', {
        body: { document_id: documentId }
      });

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error(t('Error al cargar contenido', 'Error loading content'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (type: keyof SelectedItems, id: string) => {
    setSelected((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(id)) {
        updated[type] = updated[type].filter((i) => i !== id);
      } else {
        updated[type] = [...updated[type], id];
      }
      onSelectionChange(updated);
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">{t('Cargando contenido...', 'Loading content...')}</span>
      </div>
    );
  }

  if (!content || !content.content || content.content.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-muted-foreground">
        {t('No se encontró contenido en este PDF', 'No content found in this PDF')}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        {t('Contenido del PDF:', 'PDF Content:')}
      </h2>
      <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
        {content.content.map((item: any) => (
          <ContentItem
            key={item.id}
            item={item}
            type={item.type}
            selected={
              item.type === 'text'
                ? selected.texts.includes(item.id)
                : item.type === 'image'
                ? selected.images.includes(item.id)
                : selected.questions.includes(item.id)
            }
            onToggle={() => {
              const selectionType =
                item.type === 'text' ? 'texts' : item.type === 'image' ? 'images' : 'questions';
              toggleSelection(selectionType, item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

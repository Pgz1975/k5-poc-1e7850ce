import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ContentItem } from "./ContentItem";
import { toast } from "sonner";
import { Loader2, FileText, Image, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ContentListProps {
  documentId: string;
  onSelectionChange: (selected: SelectedItems) => void;
}

interface SelectedItems {
  texts: string[];
  images: string[];
  questions: string[];
}

interface GroupedContent {
  page_number: number;
  texts: any[];
  images: any[];
  questions: any[];
}

export function ContentList({ documentId, onSelectionChange }: ContentListProps) {
  const { t } = useLanguage();
  const [groupedContent, setGroupedContent] = useState<GroupedContent[]>([]);
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
      
      // Group content by page
      const pages = new Map<number, GroupedContent>();
      (data.content || []).forEach((item: any) => {
        if (!pages.has(item.page_number)) {
          pages.set(item.page_number, {
            page_number: item.page_number,
            texts: [],
            images: [],
            questions: []
          });
        }
        
        const page = pages.get(item.page_number)!;
        if (item.type === 'text') page.texts.push(item);
        else if (item.type === 'image') page.images.push(item);
        else if (item.type === 'question') page.questions.push(item);
      });

      setGroupedContent(Array.from(pages.values()).sort((a, b) => a.page_number - b.page_number));
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

  if (groupedContent.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-muted-foreground">
        {t('No se encontró contenido en este PDF', 'No content found in this PDF')}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {t('Contenido del PDF:', 'PDF Content:')}
      </h2>
      
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
        {groupedContent.map((page) => (
          <div key={page.page_number} className="border rounded-lg p-4 bg-gradient-to-br from-background to-muted/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📄 {t('Página', 'Page')} {page.page_number}
            </h3>
            
            <div className="space-y-4">
              {/* Images Section */}
              {page.images.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <Image className="h-4 w-4" />
                    {t('Imágenes', 'Images')} ({page.images.length})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {page.images.map((item: any) => (
                      <ContentItem
                        key={item.id}
                        item={item}
                        type="image"
                        selected={selected.images.includes(item.id)}
                        onToggle={() => toggleSelection('images', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Text Section */}
              {page.texts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {t('Textos', 'Texts')} ({page.texts.length})
                  </div>
                  <div className="space-y-2">
                    {page.texts.map((item: any) => (
                      <ContentItem
                        key={item.id}
                        item={item}
                        type="text"
                        selected={selected.texts.includes(item.id)}
                        onToggle={() => toggleSelection('texts', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Section */}
              {page.questions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                    <HelpCircle className="h-4 w-4" />
                    {t('Preguntas', 'Questions')} ({page.questions.length})
                  </div>
                  <div className="space-y-2">
                    {page.questions.map((item: any) => (
                      <ContentItem
                        key={item.id}
                        item={item}
                        type="question"
                        selected={selected.questions.includes(item.id)}
                        onToggle={() => toggleSelection('questions', item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

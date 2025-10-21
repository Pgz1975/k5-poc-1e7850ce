import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PDFSelector } from "@/components/AssessmentGenerator/PDFSelector";
import { ContentList } from "@/components/AssessmentGenerator/ContentList";
import { GenerateControls } from "@/components/AssessmentGenerator/GenerateControls";
import { toast } from "sonner";

export default function AssessmentGenerator() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState({
    texts: [] as string[],
    images: [] as string[],
    questions: [] as string[]
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('pdf_documents')
      .select('*')
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      toast.error(t('Error al cargar documentos', 'Error loading documents'));
    } else {
      setDocuments(data || []);
    }
  };

  const handleGenerate = async (type: string, options: any) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-assessment', {
        body: {
          selected_items: selectedItems,
          assessment_type: type,
          grade_level: options.gradeLevel,
          language: options.language,
          source_pdf_id: selectedDocumentId
        }
      });

      if (error) throw error;

      toast.success(t('¡Evaluación creada!', 'Assessment created!'));
      navigate(`/generated/${data.assessment_id}`);
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast.error(t('Error al generar evaluación', 'Error generating assessment'));
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCount = 
    selectedItems.texts.length + 
    selectedItems.images.length + 
    selectedItems.questions.length;

  return (
    <>
      <Helmet>
        <title>{t('Generador de Evaluaciones - LecturaPR', 'Assessment Generator - LecturaPR')}</title>
        <meta name="description" content={t(
          'Crea evaluaciones educativas personalizadas para estudiantes K-5',
          'Create personalized educational assessments for K-5 students'
        )} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              {t('📚 Generador de Evaluaciones', '📚 Assessment Generator')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(
                'Selecciona contenido de tus PDFs y crea actividades educativas',
                'Select content from your PDFs and create educational activities'
              )}
            </p>
          </header>

          <div className="max-w-5xl mx-auto space-y-6">
            <PDFSelector
              documents={documents}
              selectedId={selectedDocumentId}
              onSelect={setSelectedDocumentId}
            />

            {selectedDocumentId && (
              <>
                <ContentList
                  documentId={selectedDocumentId}
                  onSelectionChange={setSelectedItems}
                />

                <GenerateControls
                  selectedCount={selectedCount}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

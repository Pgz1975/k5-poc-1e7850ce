import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { CoquiMascot } from "@/components/CoquiMascot";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { toast } from "sonner";

export default function GeneratedAssessment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [assessment, setAssessment] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAssessment();
    }
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-assessment', {
        body: { id }
      });

      if (error) throw error;
      setAssessment(data);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast.error(t('Error al cargar evaluación', 'Error loading assessment'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-50">
        <div className="text-center">
          <CoquiMascot state="thinking" size="large" />
          <p className="mt-4 text-xl font-medium">
            {t('Cargando...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.content?.pages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-50">
        <div className="text-center">
          <CoquiMascot state="thinking" size="large" />
          <p className="mt-4 text-xl font-medium">
            {t('Evaluación no encontrada', 'Assessment not found')}
          </p>
          <Button onClick={() => navigate('/assessment-generator')} className="mt-4">
            {t('Volver', 'Go Back')}
          </Button>
        </div>
      </div>
    );
  }

  const pages = assessment.content.pages;
  const currentPageData = pages[currentPage];
  const progress = ((currentPage + 1) / pages.length) * 100;

  return (
    <>
      <Helmet>
        <title>{t('Evaluación - LecturaPR', 'Assessment - LecturaPR')}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/student-dashboard')}
                >
                  <Home className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {currentPage + 1} / {pages.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px] flex flex-col">
              {/* Page Title */}
              {currentPageData.title && (
                <h2 className="text-3xl font-bold text-center mb-6 text-primary">
                  {currentPageData.title}
                </h2>
              )}

              {/* Images */}
              {currentPageData.images && currentPageData.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentPageData.images.map((img: any, idx: number) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={img.alt_text || `Image ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

              {/* Text Content */}
              {currentPageData.type === 'reading_text' && (
                <div className="prose prose-lg max-w-none flex-1">
                  <p className="text-2xl leading-relaxed">
                    {currentPageData.text}
                  </p>
                </div>
              )}

              {/* Question */}
              {currentPageData.type === 'question' && (
                <div className="flex-1 space-y-6">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6">
                    <p className="text-2xl font-semibold text-center">
                      {currentPageData.question_text}
                    </p>
                  </div>

                  {currentPageData.options && (
                    <div className="grid grid-cols-1 gap-4">
                      {currentPageData.options.map((option: any, idx: number) => (
                        <button
                          key={idx}
                          className="p-6 text-xl font-medium border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-blue-50 transition-all text-left"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Mascot */}
              <div className="mt-6 flex justify-center">
                <CoquiMascot 
                  state="happy" 
                  size="medium"
                  message={t('¡Muy bien!', 'Great job!')}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {t('Anterior', 'Previous')}
              </Button>

              <Button
                size="lg"
                onClick={() => {
                  if (currentPage < pages.length - 1) {
                    setCurrentPage(currentPage + 1);
                  } else {
                    navigate('/student-dashboard');
                  }
                }}
              >
                {currentPage < pages.length - 1 ? (
                  <>
                    {t('Siguiente', 'Next')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  t('Finalizar', 'Finish')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

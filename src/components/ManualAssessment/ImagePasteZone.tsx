import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, X, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePasteZoneProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string | null;
  correctAnswer?: string; // Auto-fill search term from correct answer
}

export function ImagePasteZone({ onImageUploaded, currentImage, correctAnswer }: ImagePasteZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isFetchingPexels, setIsFetchingPexels] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [searchTerm, setSearchTerm] = useState(correctAnswer || '');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('manual-assessment-images')
        .upload(filename, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('manual-assessment-images')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: t("¡Imagen cargada!", "Image uploaded!"),
        description: t("Tu imagen ha sido añadida.", "Your image has been added.")
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t("Error al cargar", "Upload failed"),
        description: t("No se pudo cargar la imagen. Intenta de nuevo.", "Could not upload image. Please try again."),
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          await uploadImage(file);
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  const fetchPexelsImage = async (query: string) => {
    if (!query.trim()) {
      toast({
        title: t("Término requerido", "Search term required"),
        description: t("Ingresa un término de búsqueda", "Please enter a search term"),
        variant: 'destructive'
      });
      return;
    }

    setIsFetchingPexels(true);
    try {
      console.log('Fetching Pexels image for:', query);
      
      // Request multiple images and pick a random one to avoid caching
      const { data, error } = await supabase.functions.invoke('search-pexels', {
        body: { query: query.trim(), per_page: 15 }
      });

      console.log('Pexels response:', { data, error });

      if (error) {
        console.error('Pexels error:', error);
        throw error;
      }

      // Handle the new response structure with images array
      if (data?.images && data.images.length > 0) {
        // Pick a random image from results
        const randomIndex = Math.floor(Math.random() * data.images.length);
        const selectedImage = data.images[randomIndex];
        const imageUrl = selectedImage.url;
        setPreviewUrl(imageUrl);
        onImageUploaded(imageUrl);
        
        toast({
          title: t("¡Imagen encontrada!", "Image found!"),
          description: t(`Imagen de ${selectedImage.photographer}`, `Image by ${selectedImage.photographer}`)
        });
      } else if (data?.photos && data.photos.length > 0) {
        // Fallback for old response format - pick random
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        const selectedPhoto = data.photos[randomIndex];
        const imageUrl = selectedPhoto.src.large;
        setPreviewUrl(imageUrl);
        onImageUploaded(imageUrl);
        
        toast({
          title: t("¡Imagen encontrada!", "Image found!"),
          description: t(`Imagen de ${selectedPhoto.photographer}`, `Image by ${selectedPhoto.photographer}`)
        });
      } else {
        toast({
          title: t("Sin resultados", "No results"),
          description: t("Intenta con otro término", "Try a different search term"),
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Pexels fetch error:', error);
      toast({
        title: t("Error al buscar", "Search failed"),
        description: error instanceof Error ? error.message : t("No se pudo buscar en Pexels", "Could not search Pexels"),
        variant: 'destructive'
      });
    } finally {
      setIsFetchingPexels(false);
    }
  };

  const handleAutoFetch = () => {
    const term = correctAnswer || searchTerm;
    if (term) {
      fetchPexelsImage(term);
    } else {
      setShowSearchInput(true);
    }
  };

  return (
    <Card
      className="p-6 border-2 border-dashed bg-accent/5"
      onPaste={handlePaste}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain rounded border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Re-fetch button when image is loaded */}
          <div className="flex gap-2">
            {!showSearchInput ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoFetch}
                disabled={isFetchingPexels}
                className="flex-1"
              >
                {isFetchingPexels ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {t("Buscar otra imagen", "Get another image")}
              </Button>
            ) : (
              <>
                <Input
                  placeholder={t("Término de búsqueda...", "Search term...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchPexelsImage(searchTerm)}
                  className="flex-1"
                />
                <Button
                  onClick={() => fetchPexelsImage(searchTerm)}
                  disabled={isFetchingPexels}
                  size="sm"
                >
                  {isFetchingPexels ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          {isUploading || isFetchingPexels ? (
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          ) : (
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          )}

          <p className="text-lg font-medium mb-2 text-foreground">
            {t("Pega una imagen (Ctrl+V) o haz clic para seleccionar", "Paste image (Ctrl+V) or click to select")}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("Puedes copiar desde cualquier lugar", "You can copy from anywhere")}
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
                disabled={isUploading || isFetchingPexels}
              >
                {t("Seleccionar Archivo", "Select File")}
              </Button>
              
              <Button
                onClick={handleAutoFetch}
                disabled={isUploading || isFetchingPexels}
                variant="default"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t("Buscar en Pexels", "Search Pexels")}
              </Button>
            </div>

            {showSearchInput && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder={t("Término de búsqueda...", "Search term...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchPexelsImage(searchTerm)}
                  autoFocus
                />
                <Button
                  onClick={() => fetchPexelsImage(searchTerm)}
                  disabled={isFetchingPexels}
                >
                  {isFetchingPexels ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

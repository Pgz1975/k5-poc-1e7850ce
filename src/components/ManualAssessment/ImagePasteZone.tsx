import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImagePasteZoneProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string | null;
}

export function ImagePasteZone({ onImageUploaded, currentImage }: ImagePasteZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
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
      ) : (
        <div className="text-center py-8">
          {isUploading ? (
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

          <Button
            onClick={() => inputRef.current?.click()}
            variant="outline"
            disabled={isUploading}
          >
            {t("Seleccionar Archivo", "Select File")}
          </Button>
        </div>
      )}
    </Card>
  );
}

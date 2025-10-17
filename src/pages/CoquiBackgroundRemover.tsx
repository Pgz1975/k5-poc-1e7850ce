import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { removeBackground, loadImage } from "@/utils/removeBackground";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

// All Coqui images that need background removal
const coquiImages = [
  { name: 'coqui.webp', path: '/assets/coqui/coqui.webp' },
  { name: 'confetti_celebration.webp', path: '/assets/coqui/confetti_celebration.webp' },
  { name: 'excited.webp', path: '/assets/coqui/excited.webp' },
  { name: 'graduation_cap_moment.webp', path: '/assets/coqui/graduation_cap_moment.webp' },
  { name: 'happy.webp', path: '/assets/coqui/happy.webp' },
  { name: 'holding_trophy.webp', path: '/assets/coqui/holding_trophy.webp' },
  { name: 'holding_up_score_card.webp', path: '/assets/coqui/holding_up_score_card.webp' },
  { name: 'neutral_waiting.webp', path: '/assets/coqui/neutral_waiting.webp' },
  { name: 'pointing_at_text.webp', path: '/assets/coqui/pointing_at_text.webp' },
  { name: 'reading_book.webp', path: '/assets/coqui/reading_book.webp' },
  { name: 'speaking.webp', path: '/assets/coqui/speaking.webp' },
  { name: 'thinking.webp', path: '/assets/coqui/thinking.webp' },
  { name: 'using_magnifying_glass.webp', path: '/assets/coqui/using_magnifying_glass.webp' },
  { name: 'waiting.webp', path: '/assets/coqui/waiting.webp' },
  { name: 'wearing_gold_medal.webp', path: '/assets/coqui/wearing_gold_medal.webp' },
  { name: 'writing_taking_notes.webp', path: '/assets/coqui/writing_taking_notes.webp' },
];

interface ProcessedImage {
  name: string;
  originalUrl: string;
  processedBlob?: Blob;
  processedUrl?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  error?: string;
}

export default function CoquiBackgroundRemover() {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>(
    coquiImages.map(img => ({
      name: img.name,
      originalUrl: img.path,
      status: 'pending' as const,
    }))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const processAllImages = async () => {
    setIsProcessing(true);
    setCurrentIndex(0);

    for (let i = 0; i < coquiImages.length; i++) {
      setCurrentIndex(i);
      const image = coquiImages[i];

      // Update status to processing
      setProcessedImages(prev => 
        prev.map((img, idx) => 
          idx === i ? { ...img, status: 'processing' as const } : img
        )
      );

      try {
        // Fetch the image
        const response = await fetch(image.path);
        const blob = await response.blob();
        
        // Load image element
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        const processedUrl = URL.createObjectURL(processedBlob);

        // Update with processed result
        setProcessedImages(prev =>
          prev.map((img, idx) =>
            idx === i
              ? {
                  ...img,
                  processedBlob,
                  processedUrl,
                  status: 'complete' as const,
                }
              : img
          )
        );

        toast.success(`Processed ${image.name}`);
      } catch (error) {
        console.error(`Error processing ${image.name}:`, error);
        setProcessedImages(prev =>
          prev.map((img, idx) =>
            idx === i
              ? {
                  ...img,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              : img
          )
        );
        toast.error(`Failed to process ${image.name}`);
      }
    }

    setIsProcessing(false);
    toast.success('All images processed!');
  };

  const downloadImage = (image: ProcessedImage) => {
    if (!image.processedBlob) return;

    const url = URL.createObjectURL(image.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.name.replace('.webp', '_no_bg.png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    processedImages.forEach(img => {
      if (img.status === 'complete' && img.processedBlob) {
        setTimeout(() => downloadImage(img), 100);
      }
    });
    toast.success('Downloading all processed images!');
  };

  const progress = (processedImages.filter(img => img.status === 'complete').length / coquiImages.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-8">
      <div className="container max-w-6xl mx-auto">
        <Card className="mb-8 border-4 border-primary/20">
          <CardHeader>
            <CardTitle className="text-4xl font-heading text-primary">
              🐸 Coquí Background Remover
            </CardTitle>
            <CardDescription className="text-lg">
              Remove backgrounds from all Coquí mascot images using AI. This will process all 16 images.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={processAllImages}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing {currentIndex + 1}/{coquiImages.length}
                    </>
                  ) : (
                    '🚀 Process All Images'
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={downloadAll}
                  disabled={processedImages.filter(img => img.status === 'complete').length === 0}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download All ({processedImages.filter(img => img.status === 'complete').length})
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-center text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {processedImages.map((image, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm truncate">{image.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Original */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Original</p>
                        <img
                          src={image.originalUrl}
                          alt={`Original ${image.name}`}
                          className="w-full h-32 object-contain bg-white border rounded"
                        />
                      </div>

                      {/* Processed */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Processed</p>
                        <div className="relative w-full h-32 bg-checkerboard border rounded">
                          {image.processedUrl ? (
                            <img
                              src={image.processedUrl}
                              alt={`Processed ${image.name}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              {image.status === 'pending' && '⏳'}
                              {image.status === 'processing' && <Loader2 className="h-6 w-6 animate-spin" />}
                              {image.status === 'error' && '❌'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {image.status === 'complete' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => downloadImage(image)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                      </Button>
                    )}

                    {image.status === 'error' && (
                      <p className="text-xs text-destructive">{image.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-warning">
          <CardHeader>
            <CardTitle className="text-lg">📋 Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Click "Process All Images" to remove backgrounds using AI</p>
            <p><strong>2.</strong> Wait for all images to process (this may take a few minutes)</p>
            <p><strong>3.</strong> Click "Download All" to get all processed images as PNG files</p>
            <p><strong>4.</strong> Replace the original .webp files in /public/assets/coqui/ with the new PNG files</p>
            <p className="text-warning font-semibold mt-4">
              ⚠️ Note: The AI model will download on first use (~50MB). Processing uses your device's GPU.
            </p>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .bg-checkerboard {
          background-image: linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
            linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}

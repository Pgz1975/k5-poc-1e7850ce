import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { searchPexelsImage, PexelsImage } from "@/utils/pexelsApi";
import { Loader2 } from "lucide-react";

interface IllustrationPanelProps {
  imageQuery: string;
}

export const IllustrationPanel = ({ imageQuery }: IllustrationPanelProps) => {
  const [image, setImage] = useState<PexelsImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const result = await searchPexelsImage(imageQuery);
      setImage(result);
      setLoading(false);
    };

    fetchImage();
  }, [imageQuery]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 shadow-soft h-[400px] flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading image...</p>
        </div>
      ) : image ? (
        <div className="relative w-full h-full">
          <img
            src={image.src.large}
            alt={imageQuery}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            Photo by{" "}
            <a
              href={image.photographer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {image.photographer}
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center p-6">
          <p className="text-muted-foreground">No image found</p>
        </div>
      )}
    </Card>
  );
};

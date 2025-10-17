import { supabase } from "@/integrations/supabase/client";

export interface PexelsImage {
  id: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

export const searchPexelsImage = async (query: string): Promise<PexelsImage | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-pexels-image', {
      body: { query }
    });

    if (error) {
      console.error('Error fetching Pexels image:', error);
      return null;
    }

    if (data.photos && data.photos.length > 0) {
      return data.photos[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
};

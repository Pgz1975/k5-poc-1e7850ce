const PEXELS_API_KEY = 'qkM4YgMsvvJKCWtfUWepvjVBRGFwqRHPsgxiCcZFRfMzqq8RJE8KJYkd';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

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
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      console.error('Pexels API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      return data.photos[0];
    }

    return null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
};

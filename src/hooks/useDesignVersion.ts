import { useState, useEffect } from 'react';

export function useDesignVersion() {
  const [useV2Design, setUseV2Design] = useState(() => {
    return localStorage.getItem('useV2Design') === 'true';
  });

  const toggleDesignVersion = () => {
    const newValue = !useV2Design;
    setUseV2Design(newValue);
    localStorage.setItem('useV2Design', String(newValue));
    window.location.reload(); // Reload to apply new design
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'useV2Design') {
        setUseV2Design(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { useV2Design, toggleDesignVersion };
}

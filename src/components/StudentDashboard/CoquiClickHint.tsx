import { Hand } from "lucide-react";
import { useEffect, useState } from "react";

export const CoquiClickHint = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the hint before
    const dismissed = localStorage.getItem("coqui-hint-dismissed");
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("coqui-hint-dismissed", "true");
  };

  // Reset visibility when navigating to the page
  useEffect(() => {
    const handleFocus = () => {
      const dismissed = localStorage.getItem("coqui-hint-dismissed");
      if (!dismissed) {
        setVisible(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="absolute -bottom-2 -right-2 pointer-events-none z-10 animate-bounce-hand"
      onClick={handleDismiss}
    >
      <Hand 
        className="w-8 h-8 text-primary transform rotate-[-30deg]" 
        fill="currentColor"
      />
      <style>
        {`
          @keyframes bounceHand {
            0%, 100% { transform: translate(0, 0) rotate(-30deg); }
            50% { transform: translate(-5px, -5px) rotate(-30deg); }
          }
          .animate-bounce-hand {
            animation: bounceHand 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

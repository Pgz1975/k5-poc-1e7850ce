import { useState, useEffect } from 'react';
import { coquiStates, coquiAnimations, coquiSizes, coquiPositions } from '@/config/coquiConfig';

/**
 * CoquiMascot - Animated mascot component for LecturaPR
 * 
 * @param {string} state - Current mascot state (e.g., 'idle', 'happy', 'thinking')
 * @param {string} size - Size preset: 'small', 'medium', 'default', 'large'
 * @param {string} position - Position preset: 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'bottom-center', 'inline'
 * @param {string} className - Additional CSS classes
 * @param {string} alt - Alt text for accessibility (defaults to state)
 */
export const CoquiMascot = ({
  state = 'idle',
  size = 'default',
  position = 'bottom-right',
  className = '',
  alt = null
}) => {
  const [currentAnimation, setCurrentAnimation] = useState('');
  const [imageSrc, setImageSrc] = useState(coquiStates.default);

  // Update image and animation when state changes
  useEffect(() => {
    // Get the image path for the current state, fallback to default
    const newImageSrc = coquiStates[state] || coquiStates.default;
    setImageSrc(newImageSrc);

    // Get the animation for the current state
    const animation = coquiAnimations[state] || '';

    // Trigger animation
    if (animation) {
      setCurrentAnimation('');
      // Force reflow to restart animation
      setTimeout(() => {
        setCurrentAnimation(animation);
      }, 10);
    }
  }, [state]);

  // Build the complete className
  const sizeClass = coquiSizes[size] || coquiSizes.default;
  const positionClass = coquiPositions[position] || coquiPositions['bottom-right'];
  const animationClass = currentAnimation;
  return <div className={`${positionClass} z-50 transition-opacity duration-200 ${className}`} role="img" aria-label={alt || `Coquí mascot in ${state} state`}>
      
    </div>;
};
export default CoquiMascot;
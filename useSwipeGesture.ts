import { useState, useCallback } from "react";

interface UseSwipeGestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100
}: UseSwipeGestureProps) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      
      // Swipe left
      if (diff < -threshold && onSwipeLeft) {
        onSwipeLeft();
      }
      
      // Swipe right
      if (diff > threshold && onSwipeRight) {
        onSwipeRight();
      }
      
      setTouchStartX(null);
    },
    [touchStartX, onSwipeLeft, onSwipeRight, threshold]
  );

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd
    }
  };
}

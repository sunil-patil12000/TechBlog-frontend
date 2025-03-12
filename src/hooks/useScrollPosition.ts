import { useState, useEffect, useCallback } from 'react';

interface ScrollPositionOptions {
  thresholdUp?: number;
  thresholdDown?: number;
  scrollUpThreshold?: number;
  scrollDownThreshold?: number;
  throttleMs?: number;
}

interface ScrollPositionReturn {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isVisible: boolean;
  isAtTop: boolean;
  isFullyScrolled: boolean;
  progress: number;
  hasScrolled: boolean;
  scrollPosition: number;
}

/**
 * Custom hook that tracks scroll position and direction with smart visibility control
 * 
 * @param options Configuration options for scroll behavior
 * @returns Object with scroll position data and visibility state
 */
function useScrollPosition({
  thresholdUp = 50,              // Minimum scroll distance needed to show on scroll up
  thresholdDown = 100,           // Minimum scroll distance needed to hide on scroll down
  scrollUpThreshold = 0,         // Minimum distance from top to be able to hide
  scrollDownThreshold = 100,     // Minimum distance from top to be able to hide
  throttleMs = 100,              // Throttle time in milliseconds
}: ScrollPositionOptions = {}): ScrollPositionReturn {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isFullyScrolled, setIsFullyScrolled] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Memoized scroll handler to prevent re-creation on each render
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const maxScroll = scrollHeight - clientHeight;
    const currentProgress = Math.min(100, Math.max(0, (currentScrollY / maxScroll) * 100));
    
    // Track if page has any scroll at all
    if (!hasScrolled && currentScrollY > 0) {
      setHasScrolled(true);
    }
    
    // Detect if at the very top
    setIsAtTop(currentScrollY < scrollUpThreshold);
    
    // Detect if fully scrolled to bottom
    setIsFullyScrolled(Math.abs(maxScroll - currentScrollY) < 5);
    
    // Track scroll progress
    setProgress(currentProgress);
    
    // Determine scroll direction
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    
    // Only update state if the direction changed or we've moved enough
    if (
      direction !== scrollDirection || 
      Math.abs(currentScrollY - lastScrollY) >= (direction === 'up' ? thresholdUp : thresholdDown)
    ) {
      setScrollDirection(direction);
      
      // Determine visibility: show when scrolling up or at the top, hide when scrolling down
      if (direction === 'up') {
        setIsVisible(true);
      } else if (direction === 'down' && currentScrollY > scrollDownThreshold) {
        setIsVisible(false);
      }
    }
    
    setScrollY(currentScrollY);
    setLastScrollY(currentScrollY);
    setScrollPosition(currentScrollY);
  }, [
    lastScrollY, 
    scrollDirection, 
    thresholdUp, 
    thresholdDown, 
    scrollUpThreshold, 
    scrollDownThreshold, 
    hasScrolled
  ]);
  
  // Set up scroll listener with throttling
  useEffect(() => {
    // Initialize with current scroll position
    setScrollY(window.scrollY);
    setLastScrollY(window.scrollY);
    
    let ticking = false;
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Handle events better on iOS and mobile devices
    const events = ['scroll', 'touchmove', 'touchend'];
    events.forEach(event => window.addEventListener(event, onScroll, { passive: true }));
    
    return () => {
      events.forEach(event => window.removeEventListener(event, onScroll));
    };
  }, [handleScroll, throttleMs]);
  
  return {
    scrollY,
    scrollDirection,
    isVisible,
    isAtTop,
    isFullyScrolled,
    progress,
    hasScrolled,
    scrollPosition
  };
}

export default useScrollPosition; 
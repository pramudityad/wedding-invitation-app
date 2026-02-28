import { useRef, useState, useEffect } from 'react';

/**
 * Hook that tracks whether an element is visible in the viewport via IntersectionObserver.
 * Returns a ref to attach to the target element and a boolean indicating visibility.
 *
 * @param {boolean} enabled - Whether to activate the observer (e.g. after splash dismissed)
 * @param {IntersectionObserverInit} options - IntersectionObserver options override
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export default function useScrollAnimation(enabled = true, options) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, isVisible, options]);

  return [ref, isVisible];
}

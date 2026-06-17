import { useEffect, useRef } from 'react';

export default function useScrollReveal() {
  const observerRef = useRef(null);

  useEffect(() => {
    // Create the intersection observer instance
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Unobserve once revealed to keep animation static
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.10, // Reveal when 10% of element is in viewport
        rootMargin: '0px 0px -30px 0px', // Delay slightly for a smoother entry
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Callback ref to register elements
  const revealRef = (el) => {
    if (el && observerRef.current) {
      el.classList.add('scroll-reveal');
      observerRef.current.observe(el);
    }
  };

  return revealRef;
}

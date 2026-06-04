import { useEffect, useRef } from 'react';

export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) callback();
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  // options are constant at call site — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback]);

  return ref;
}

import { useEffect, useRef } from "react";

const useDebounceHandler = (
  callback: () => void,
  deps: any[] = [],
  delay: number = 500,
  onDebounceStart?: () => void,
  debounceRef: any = useRef<NodeJS.Timeout | null>(null),
) => {
  // const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (onDebounceStart) {
      onDebounceStart();
    }

    if (debounceRef?.current) {
      clearTimeout(debounceRef?.current);
    }

    debounceRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (debounceRef?.current) {
        clearTimeout(debounceRef?.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};

export default useDebounceHandler;

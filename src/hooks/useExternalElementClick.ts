import { RefObject, useEffect } from 'react';

export const useExternalElementClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: (e: Event) => void,
  dependencies: boolean[] = [],
) => {
  const handleClick = (e: Event) => {
    const target = e.target as Node;
    if (ref?.current?.contains(target)) {
      return;
    }

    callback(e);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, dependencies);
};

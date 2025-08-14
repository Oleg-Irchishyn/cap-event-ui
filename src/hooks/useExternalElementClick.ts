import { RefObject, useEffect } from 'react';

export const useExternalElementClick = (
  ref: RefObject<HTMLDivElement | null>,
  callback: (e: Event) => void,
  dependencies: boolean[] = [],
) => {
  const handleClick = (e: Event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (ref?.current?.contains(e.target)) {
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

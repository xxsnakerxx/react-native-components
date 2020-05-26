import {useRef} from 'react';

export const useTimeBlockedCallback = (
  callback?: (...args: any[]) => void,
  timeBlocked = 500,
) => {
  const isBlockedRef = useRef(false);

  if (!callback) {
    return () => {};
  }

  return (...callbackArgs: any[]) => {
    if (!isBlockedRef.current) {
      callback(...callbackArgs);
    }

    setTimeout(() => {
      isBlockedRef.current = false;
    }, timeBlocked);

    isBlockedRef.current = true;
  };
};

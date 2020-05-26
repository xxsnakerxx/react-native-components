import {useRef, useCallback} from 'react';

export const useTimeBlockedCallback = (
  callback?: (...args: any[]) => void,
  timeBlocked = 500,
) => {
  const isBlockedRef = useRef(false);

  const callbackHook = useCallback(
    (...callbackArgs: any[]) => {
      if (!callback) {
        return;
      }

      if (!isBlockedRef.current) {
        callback(...callbackArgs);
      }

      setTimeout(() => {
        isBlockedRef.current = false;
      }, timeBlocked);

      isBlockedRef.current = true;
    },
    [callback, timeBlocked],
  );

  return callbackHook;
};

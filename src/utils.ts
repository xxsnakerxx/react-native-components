import {useRef, useCallback} from 'react';

export const useTimeBlockedCallback = (
  cb?: (...args: any[]) => void,
  timeBlocked = 500,
) => {
  const isBlockedRef = useRef(false);

  const callback = useCallback(
    (...cbArgs: any[]) => {
      if (!cb) {
        return;
      }

      if (!isBlockedRef.current) {
        cb(...cbArgs);
      }

      setTimeout(() => {
        isBlockedRef.current = false;
      }, timeBlocked);

      isBlockedRef.current = true;
    },
    [cb, timeBlocked],
  );

  return callback;
};

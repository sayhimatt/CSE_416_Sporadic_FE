import { useEffect, useLayoutEffect, useRef } from "react";

function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.

  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;

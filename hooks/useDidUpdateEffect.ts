import { useEffect, useRef } from "react";

export default function useDidUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
    // eslint-disable-next-line
  }, inputs);
}

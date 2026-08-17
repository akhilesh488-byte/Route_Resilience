import { useEffect, useRef } from "react";

export function useEffectOnMount(effect: () => void | (() => void)) {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  useEffect(() => {
    return effectRef.current();
  }, []);
}

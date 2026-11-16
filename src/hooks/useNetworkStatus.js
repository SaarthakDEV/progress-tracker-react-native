import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const updateStatus = (state) => {
      if (cancelled) return;
      setIsOffline(state.isConnected === false);
    };

    const unsubscribe = NetInfo.addEventListener(updateStatus);

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { isOffline };
};

import { useEffect, useRef } from "react";
import { AppState, BackHandler } from "react-native";
import useLogout from "./useLogout";

const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes

export default function useAutoLogout() {
  const timerRef = useRef(null);
  const logout = useLogout();

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      logout();
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    resetTimer();

    const appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        resetTimer();
      }
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        resetTimer();
        return false;
      }
    );

    return () => {
      clearTimeout(timerRef.current);
      appStateListener.remove();
      backHandler.remove();
    };
  }, []);

  return { resetTimer };
}

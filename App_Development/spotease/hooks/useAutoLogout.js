import { useEffect, useRef } from 'react';
import { AppState, Alert, BackHandler, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

//const AUTO_LOGOUT_TIME = 10 * 1000; // 10s for testing

const AUTO_LOGOUT_TIME = 600000;
export default function useAutoLogout() {
  const timerRef = useRef(null);
  const router = useRouter();

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You were logged out due to inactivity.");
      router.replace("/(auth)/login");
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    resetTimer(); // Start timer on mount

    // 👂 Reset timer when app becomes active
    const appStateListener = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        resetTimer();
      }
    });

    // 👂 Reset on hardware back button (Android)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      resetTimer();
      return false;
    });

    // 👂 Basic touch gesture override (low-level listener not possible here, needs to be called manually in app or wrap in Pressable)

    return () => {
      clearTimeout(timerRef.current);
      appStateListener.remove();
      backHandler.remove();
    };
  }, []);

  return { resetTimer }; // expose this to screens (if needed)
}

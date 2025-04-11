import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged Out", "You have been logged out.");
      router.replace("/(auth)/onboarding");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Something went wrong while logging out.");
    }
  };

  return logout;
};

export default useLogout;

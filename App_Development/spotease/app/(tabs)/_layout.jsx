import { Text, StyleSheet, Alert } from "react-native";
import { Tabs, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { Colors } from "./../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TABS = [
  {
    name: "home",
    label: "Home",
    icon: (color) => <AntDesign name="home" size={24} color={color} />,
  },
  {
    name: "history",
    label: "History",
    icon: (color) => (
      <MaterialIcons name="location-history" size={24} color={color} />
    ),
  },
  {
    name: "logOut", // This will be our action tab
    label: "Logout",
    icon: (color) => <MaterialIcons name="logout" size={24} color={color} />,
    isAction: true, // Flag to identify this as an action tab
  },
];

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabButtonColour,
        tabBarInactiveTintColor: "#888",
      }}
    >
      {TABS.map(({ name, label, icon, isAction }) => (
        <Tabs.Screen
          key={name}
          name={name}
          listeners={{
            tabPress: (e) => {
              if (name === "logout") {
                e.preventDefault(); // Prevent default navigation
                handleLogout();
              }
            },
          }}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <Text
                style={[
                  styles.tabLabel,
                  focused && styles.tabLabelActive,
                  { color },
                ]}
              >
                {label}
              </Text>
            ),
            tabBarIcon: ({ color }) => icon(color),
          }}
        />
      ))}
    </Tabs>
  );
}

// 🎨 Styles (keep your existing styles)
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundColour,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
  },
  tabLabelActive: {
    fontSize: 10.5,
    fontFamily: "Poppins-Bold",
  },
});

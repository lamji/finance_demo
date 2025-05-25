import ProfileScreen from "@/components/screens/profiles";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { StatusBar } from "react-native";

export default function SettingsScreen() {
  const { safeAreaBackground, theme } = useHeaderTheme();
  return (
    <>
      <StatusBar
        backgroundColor={safeAreaBackground}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <ProfileScreen />
    </>
  );
}

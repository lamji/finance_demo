import DebtsDetailsScreen from "@/components/screens/debtsDetails";
import useHeaderTheme from "@/hooks/useHeaderTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DebtDetailsScreen() {
  const { id } = useLocalSearchParams();
  const debtId = typeof id === "string" ? id : "";
  const { theme, safeAreaBackground, headerBgColors } = useHeaderTheme();

  return (
    <>
      <StatusBar
        backgroundColor={safeAreaBackground}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: safeAreaBackground }}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Debt Details",
            headerBackTitle: "Back",
            headerTransparent: false,
            headerTintColor: "#fff", // Always white
            headerTitleStyle: {
              color: "#fff", // White title
              fontWeight: '600',
            },
            headerStyle: [
              {
                backgroundColor: headerBgColors[theme], // Match the card background
              },
              // @ts-ignore - borderBottomWidth is valid but not in the type definition
              { borderBottomWidth: 0 }, // Remove bottom border
              // @ts-ignore - elevation is valid but not in the type definition
              { elevation: 0 }, // Remove shadow on Android
              // @ts-ignore - shadowOpacity is valid but not in the type definition
              { shadowOpacity: 0 }, // Remove shadow on iOS
            ],
          }}
        />
        <DebtsDetailsScreen id={debtId} />
      </SafeAreaView>
    </>
  );
}

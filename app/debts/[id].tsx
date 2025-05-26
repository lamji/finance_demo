import DebtDetailsScreenIns from "@/components/screens/debtsDetails";
import { Stack, useGlobalSearchParams } from "expo-router";

export default function DebtDetailsScreen() {
  const { id } = useGlobalSearchParams();
  const debtId = typeof id === "string" ? id : "";

  return (
    <Stack>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerBackTitle: "Back",
          headerTransparent: true,
          headerTintColor: "#fff",
        }}
      />
      <DebtDetailsScreenIns id={debtId} />
    </Stack>
  );
}

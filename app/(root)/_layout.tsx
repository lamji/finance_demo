import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="debts/add"
          options={{
            title: 'Add New Debt',
            headerBackTitle: 'Back',
            presentation: 'card'
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

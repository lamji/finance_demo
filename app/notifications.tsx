import NotificationScreen from "@/components/screens/notifications";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function Notifications() {
  return (
    <>
      {/* White StatusBar with dark content */}
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <NotificationScreen />
    </>
  );
}

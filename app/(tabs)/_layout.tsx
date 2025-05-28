import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useGetNotificationCount } from "@/hooks/useGetNitifcationCount";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const unreadCount = useGetNotificationCount(); // Add this line

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark
              ? Platform.select({
                  ios: "rgba(25, 25, 25, 0.7)",
                  android: "#1A1A1A",
                })
              : Platform.select({
                  ios: "rgba(255, 255, 255, 0.7)",
                  android: "#FFFFFF",
                }),
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <IconSymbol
              size={24}
              name="house.fill"
              color={color}
              style={[styles.icon, focused && styles.activeIcon]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: "Debts",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <IconSymbol
              size={24}
              name="doc.text.fill"
              color={color}
              style={[styles.icon, focused && styles.activeIcon]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: "Payments",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <IconSymbol
              size={24}
              name="creditcard.fill"
              color={color}
              style={[styles.icon, focused && styles.activeIcon]}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View style={{ width: 24, height: 24 }}>
              <IconSymbol
                size={24}
                name="person.fill"
                color={color}
                style={[styles.icon, focused && styles.activeIcon]}
              />
              {unreadCount > 0 && ( // Only show badge if there are unread notifications
                <View style={[styles.badge, { backgroundColor: "#FF3B30" }]}>
                  <ThemedText style={styles.badgeText}>
                    {unreadCount}
                  </ThemedText>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor:
      Platform.OS === "ios" ? "rgba(255, 255, 255, 0.7)" : "#FFFFFF",
    backdropFilter: "blur(10px)",
    height: Platform.OS === "ios" ? 85 : 65,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    ...Platform.select({
      ios: {
        borderRadius: 20,
        margin: 0,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 16,
        elevation: 8,
      },
    }),
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  tabIcon: {
    marginBottom: -4,
  },
  icon: {
    opacity: 0.8,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  badge: {
    position: "absolute",
    top: -15,
    right: -15,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 14,
  },
});

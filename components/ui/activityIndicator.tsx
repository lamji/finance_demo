import { RootState } from "@/store";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface LoadingOverlayProps {
  loadingKey?: string;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loadingKey,
  message = "Loading...",
  fullScreen = false,
}) => {
  // If a specific key is provided, show only for that key
  // Otherwise, check if any loading state is active
  const isLoading = useSelector((state: RootState) => {
    if (loadingKey) {
      return state.loading[loadingKey];
    }
    return Object.values(state.loading).some((value) => value);
  });

  if (!isLoading) return null;

  return (
    <View
      style={[
        styles.container,
        fullScreen ? styles.fullScreen : styles.overlay,
      ]}
    >
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 999,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

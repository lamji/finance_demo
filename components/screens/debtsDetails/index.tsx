import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

export default function DebtDetailsScreenIns({ id }: { id?: string }) {
  const colorScheme = useColorScheme();

  const handleSubmit = React.useCallback(() => {
    Alert.alert("Button pressed!", "Edit button works!");
  }, []);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>Debt Details for ID: {id}</ThemedText>
      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: colorScheme === "dark" ? "#007AFF" : "#0A84FF",
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <ThemedText style={styles.submitButtonText}>Edit Debt</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent",
  },
  text: {
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

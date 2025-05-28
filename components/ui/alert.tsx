import { hideAlert } from "@/store/features/sliceAlert";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export const StatusAlert = () => {
  const dispatch = useDispatch();
  const { visible, type, message } = useSelector((state: any) => state.alert);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons
            name={type === "success" ? "checkmark-circle" : "close-circle"}
            size={48}
            color={type === "success" ? "#22c55e" : "#ef4444"}
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.title}>
            {type === "success" ? "Success" : "Failed"}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => dispatch(hideAlert())}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 280,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: "#444",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

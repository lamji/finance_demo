import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useGuestLogin } from "@/services/mutation/useGuestLogin";
import { loginSuccess } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme() ?? "light";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: guestLoginMutation, isPending: isGuestLoading } =
    useGuestLogin();

  const handleGuestLogin = () => {
    guestLoginMutation(undefined, {
      onSuccess: (response) => {
        const { user } = response.data;
        dispatch(
          loginSuccess({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }),
        );
        router.replace("/(tabs)");
      },
      onError: (error: Error) => {
        setError(error?.message || "Guest login failed");
      },
    });
  };

  const handleLogin = () => {
    // In a real app, you would validate credentials against a backend
    if (email && password) {
      setIsLoading(true);
      setError("");

      // Simulate API call with timeout
      setTimeout(() => {
        // Simulating a successful login
        dispatch(
          loginSuccess({
            id: "1",
            email: email,
            name: "John Doe", // In a real app, this would come from the backend
          }),
        );
        setIsLoading(false);
        router.replace("/(tabs)");
      }, 2000); // 2 seconds timeout
    } else {
      setError("Please enter both email and password");
    }
  };

  const tintColor = Colors[colorScheme].tint;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: tintColor + "10" },
                ]}
              >
                <IconSymbol
                  name="creditcard.fill"
                  size={32}
                  color={tintColor}
                />
              </View>
              <ThemedText style={styles.title}>Welcome Back</ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to continue tracking your finances
              </ThemedText>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <IconSymbol
                    name="envelope"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <IconSymbol
                    name="lock"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#666"
                    secureTextEntry
                  />
                </View>
              </View>
              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: tintColor }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.buttonText}>Sign In</ThemedText>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.forgotButton}>
                <ThemedText style={[styles.forgotText, { color: tintColor }]}>
                  Forgot Password?
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.guestButton]}
                onPress={handleGuestLogin}
                disabled={isGuestLoading}
              >
                {isGuestLoading ? (
                  <ActivityIndicator color="#666" size="small" />
                ) : (
                  <ThemedText style={styles.guestButtonText}>
                    Continue as Guest
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: "#000",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
  },
  forgotButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "500",
  },
  guestButton: {
    alignItems: "center",
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
});

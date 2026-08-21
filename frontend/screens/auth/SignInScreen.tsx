import { router } from "expo-router";
import { useSession } from "@/contexts/authContext";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FormInput } from "@/components/FormInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { Alert } from "react-native";
import { useState } from "react";
import { LoginCredentials } from "@/types/user";

export function SignInScreen() {
  const { signIn } = useSession();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signIn(credentials);
      // Navigation handled automatically by auth routing
    } catch {
      Alert.alert("Error", "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView type="center">
      <ThemedView
        type="column"
        style={{
          justifyContent: "center",
          maxWidth: 400,
          width: "100%",
          paddingHorizontal: 16,
        }}
      >
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          Welcome back!
        </ThemedText>
        <FormInput
          type="email"
          label="Email"
          leadingIcon={"mail-outline"}
          required
          value={credentials.identifier}
          onChangeText={(identifier) => {
            setCredentials((current) => ({ ...current, identifier }));
          }}
        />
        <FormInput
          type="password"
          label="Password"
          leadingIcon={"key-outline"}
          autoComplete="current-password"
          enterKeyHint="done"
          required
          value={credentials.password}
          onChangeText={(password) => {
            setCredentials((current) => ({ ...current, password }));
          }}
        />
        <ThemedView type="between" style={{ marginBottom: 16 }}>
          <ThemedCheckbox label="Remember me"></ThemedCheckbox>
          <ThemedText
            type="default"
            onPress={() => console.log("Forgot password")}
          >
            Forgot password?
          </ThemedText>
        </ThemedView>
        <ThemedButton
          title="Sign in"
          onPress={handleLogin}
          disabled={isSubmitting}
        />
        {/* <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
           <ThemedText type="default" style={{ color: Colors.light.textMuted, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} /> 
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.onSurface }} onPress={() => console.log('Continue with Google')} /> */}
        <ThemedText
          type="default"
          style={{ marginTop: 16 }}
          onPress={() => {
            router.replace("/(auth)/sign-up");
          }}
        >
          Don’t have an account? Sing up
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

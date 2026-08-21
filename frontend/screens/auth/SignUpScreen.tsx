import React, { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { Alert } from "react-native";
import { RegisterCredentials } from "@/types/user";
import { useSession } from "@/contexts/authContext";
import { FormInput } from "@/components/FormInput";

export function SignUpScreen() {
  const { signUp } = useSession();
  const [user, setUser] = useState<RegisterCredentials>({
    username: "",
    identifier: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(user);
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
          Create Account
        </ThemedText>

        <FormInput
          label="Username"
          required
          leadingIcon={"person-outline"}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
        />

        <FormInput
          label="Email"
          type="email"
          required
          leadingIcon={"mail-outline"}
          value={user.identifier}
          onChangeText={(text) => setUser({ ...user, identifier: text })}
        />

        <FormInput
          label="Password"
          type="password"
          required
          leadingIcon={"key-outline"}
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
        />

        <FormInput
          label="Confirm Password"
          type="password"
          required
          leadingIcon={"key-outline"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <ThemedView type="left" style={{ marginBottom: 16 }}>
          <ThemedCheckbox label="I agree with privacy and policy"></ThemedCheckbox>
        </ThemedView>
        <ThemedButton
          title="Sign up"
          onPress={handleSignUp}
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
            router.replace("/(auth)/sign-in");
          }}
        >
          Already have an account? Log in
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

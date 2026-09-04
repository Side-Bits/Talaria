import { router } from "expo-router";
import { useSession } from "@/contexts/authContext";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { FormInput } from "@/components/FormInput";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { Alert, StyleSheet, Image } from "react-native";
import { ApiError } from "@/services/api";
import { loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function SignInScreen() {
  const { signIn } = useSession();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = useForm<z.input<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleLogin = async (credentials: z.output<typeof loginSchema>) => {
    try {
      await new Promise((f) => setTimeout(f, 2000));

      await signIn(credentials);
      // Navigation handled automatically by auth routing
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof ApiError ? error.message : "Something went wrong",
      );
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
        <ThemedView type="center" style={{ maxHeight: 100 }}>
          <Image
            source={require("../../assets/images/favicon.png")}
            style={{ width: 100, height: 100 }}
          />
        </ThemedView>
        <ThemedText type="title" style={{ marginBottom: 16 }}>
          Welcome back!
        </ThemedText>
        <FormInput
          control={control}
          trigger={trigger}
          name="identifier"
          type="email"
          label="Email"
          leadingIcon={"mail-outline"}
          required
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="password"
          type="password"
          label="Password"
          leadingIcon={"key-outline"}
          autoComplete="current-password"
          enterKeyHint="done"
          required
          disabled={isSubmitting}
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
          onPress={handleSubmit(handleLogin)}
          loading={isSubmitting}
        />
        {/* <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
           <ThemedText type="default" style={{ color: Colors.light.textMuted, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} /> 
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.onSurface }} onPress={() => console.log('Continue with Google')} /> */}
        <ThemedText style={styles.authPrompt}>
          Don&apos;t have an account?{" "}
          <ThemedText
            type="link"
            onPress={() => router.replace("/(auth)/sign-up")}
          >
            Sign up
          </ThemedText>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  authPrompt: {
    marginTop: 16,
  },
});

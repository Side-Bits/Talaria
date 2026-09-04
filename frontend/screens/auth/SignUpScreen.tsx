import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { router } from "expo-router";
import { ThemedCheckbox } from "@/components/ThemedCheckbox";
import { Alert, StyleSheet, Image } from "react-native";
import { useSession } from "@/contexts/authContext";
import { FormInput } from "@/components/FormInput";
import { signUpSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "@/services/api";

export function SignUpScreen() {
  const { signUp } = useSession();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = useForm<z.input<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (credentials: z.output<typeof signUpSchema>) => {
    try {
      await signUp({
        username: credentials.username,
        identifier: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof ApiError ? error.message : "Something went wrong",
      );
    }
  };

  return (
    <ThemedView type="center" style={styles.screen}>
      <ThemedView type="column" style={styles.form}>
        <ThemedView type="center" style={{ maxHeight: 100 }}>
          <Image
            source={require("../../assets/images/favicon.png")}
            style={{ width: 100, height: 100 }}
          />
        </ThemedView>
        <ThemedText type="title" style={styles.title}>
          Create Account
        </ThemedText>

        <FormInput
          control={control}
          trigger={trigger}
          label="Username"
          name="username"
          required
          leadingIcon={"person-outline"}
          disabled={isSubmitting}
        />

        <FormInput
          control={control}
          trigger={trigger}
          label="Email"
          type="email"
          name="email"
          required
          leadingIcon={"mail-outline"}
          disabled={isSubmitting}
        />

        <FormInput
          control={control}
          trigger={trigger}
          label="Password"
          name="password"
          type="password"
          required
          leadingIcon={"key-outline"}
          disabled={isSubmitting}
        />

        <FormInput
          control={control}
          trigger={trigger}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          required
          leadingIcon={"key-outline"}
          disabled={isSubmitting}
        />

        <ThemedView type="left" style={styles.terms}>
          <ThemedCheckbox label="I agree with privacy and policy"></ThemedCheckbox>
        </ThemedView>
        <ThemedButton
          title="Sign up"
          onPress={handleSubmit(handleSignUp)}
          disabled={isSubmitting}
        />
        {/* <ThemedView type='between' style={{ marginTop: 16, marginBottom: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
            <ThemedText type="default" style={{ color: Colors.light.textMuted, marginLeft: 16, marginRight: 16 }}>Or</ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: Colors.light.border }} />
        </ThemedView>
        <ThemedButton title='Continue with Google' buttonStyle={{ backgroundColor: '#FAFAFA' }} textStyle={{ color: Colors.light.onSurface }} onPress={() => console.log('Continue with Google')} /> */}
        <ThemedText style={styles.authPrompt}>
          Already have an account?{" "}
          <ThemedText
            type="link"
            onPress={() => router.replace("/(auth)/sign-in")}
          >
            Sign in{" "}
          </ThemedText>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
  },
  title: {
    marginBottom: 16,
  },
  terms: {
    marginBottom: 16,
  },
  authPrompt: {
    marginTop: 16,
  },
});

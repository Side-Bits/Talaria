import { router } from 'expo-router';
import { Alert, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useSession } from '@/contexts/authContext';
import { ThemedButton } from '@/components/ThemedButton';
import { IconProfile } from '@/components/IconProfile';
import { profileSchema } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError } from '@/services/api';
import { z } from "zod";
import { FormInput } from '@/components/FormInput';
import { FormDate } from '@/components/FormDate';
import { useEffect } from 'react';
import { DEFAULT_PROFILE } from '@/types/profile';
import { getProfile, updateProfile } from '@/services/api/profile';
import { getDefaultDate } from '@/scripts/DataScripts';

export function ProfileEditorScreen() {
  const session = useSession();
  const user = session.user;
  const letter = user?.username ? user.username.charAt(0).toUpperCase() : ' ';

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { isSubmitting },
  } = useForm<z.input<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: DEFAULT_PROFILE,
  });

  const handleProfile = async (credentials: z.output<typeof profileSchema>) => {
    try {
      if (!user) {
        throw new Error("User information is unavailable");
      }

      await updateProfile({ ...credentials, id: user.id });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof ApiError
          ? error.message
          : "Something went wrong",
      );
    }
  };

  useEffect(() => {
    if (user) {
      getProfile()
        .then(data => {
          reset({
            ...DEFAULT_PROFILE,
            ...data,
            birthdate: data.birthdate.slice(0, 10),
            username: user.username,
            email: user.email,
          });
        })
        .catch(e => {
          console.error(e);
          Alert.alert('Error', 'Failed to fetch profile');
        });
    }
  }, [user, reset]);

  return (
    <ThemedView type='left'>
      <Header
        button_back={true}
        label='Edit Profile'
      />
      <ThemedView type='left' style={{ width: '100%' }}>
        <ThemedView type='left' margin={16} style={{ alignItems: 'center' }}>
          <IconProfile size={80} letter={letter} />
        </ThemedView>
        <FormInput
          control={control}
          trigger={trigger}
          name="username"
          type="text"
          label="Username"
          required
          readOnly
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="email"
          type="email"
          label="Email"
          required
          readOnly
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="name"
          type="text"
          label="Name"
          required
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="surname1"
          type="text"
          label="First surname"
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="surname2"
          type="text"
          label="Second surname"
          disabled={isSubmitting}
        />
        <FormDate
          control={control}
          trigger={trigger}
          name="birthdate"
          mode="date"
          label="Birthdate"
          required
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="language"
          type="text"
          label="Language"
          required
          readOnly
          disabled={isSubmitting}
        />
        <FormInput
          control={control}
          trigger={trigger}
          name="currency"
          type="text"
          label="Currency"
          required
          readOnly
          disabled={isSubmitting}
        />
      </ThemedView>
      <ThemedButton
        title="Edit"
        id="buttonEdit"
        style={{ marginTop: 8 }}
        onPress={handleSubmit(handleProfile)}
        loading={isSubmitting}
      />
      <View style={{ height: 100, width: "100%" }} />
    </ThemedView>
  );
}

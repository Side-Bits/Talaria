import { router } from 'expo-router';
import { Alert, Dimensions, Pressable, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/Header';
import { useSession } from '@/contexts/authContext';
import { IconProfile } from '@/components/IconProfile';
import { profileSchema } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ApiError } from '@/services/api';
import { z } from "zod";
import { FormInput } from '@/components/FormInput';
import { FormDate } from '@/components/FormDate';
import { useEffect, useState } from 'react';
import { DEFAULT_PROFILE } from '@/types/profile';
import { getProfile, updateProfile } from '@/services/api/profile';
import { isImageAsset, setImageBase64, useImagePicker } from '@/scripts/ImageScripts';
import { useToast } from '@/hooks/useToast';
import { useFooterAction } from '@/contexts/footerActionsContext';
import { useCallback, useMemo } from 'react';


export function ProfileEditorScreen() {
  const session = useSession();
  const user = session.user;
  const letter = user?.username ? user.username.charAt(0).toUpperCase() : ' ';
  const [image, setImage] = useState<string | undefined>();
  const { selectImage: pickImage } = useImagePicker();
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<z.input<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    defaultValues: DEFAULT_PROFILE,
  });

  const selectImage = async () => {
    try {
      const asset = await pickImage();

      if (!asset) {
        return;
      }

      if (!isImageAsset(asset)) {
        showToast({
          title: 'Invalid file',
          message: 'Please select an image file',
          variant: 'error',
        });
        return;
      }

      const base64 = await setImageBase64(
        asset.uri,
        Dimensions.get('window').width
      );

      setImage(base64);
      setValue('image', base64);
    } catch {
      showToast({
        title: 'Error',
        message: 'Could not process the selected image',
        variant: 'error',
      });
    }
  };

  const handleProfile = useCallback(async (credentials: z.output<typeof profileSchema>) => {
    try {
      if (!user) {
        throw new Error("User information is unavailable");
      }

      await updateProfile({ ...DEFAULT_PROFILE, ...credentials, id: user.id });
      router.back();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof ApiError
          ? error.message
          : "Something went wrong",
      );
    }
  }, [user]);

  const submitProfile = useMemo(
    () => handleSubmit(handleProfile),
    [handleSubmit, handleProfile],
  );

  useFooterAction({
    title: "Edit",
    id: "buttonEdit",
    onPress: submitProfile,
    disabled: isSubmitting,
    loading: isSubmitting,
  });

  useEffect(() => {
    if (user) {
      getProfile()
        .then(data => {
          setImage(data.image ?? undefined);
          reset({
            ...DEFAULT_PROFILE,
            ...data,
            birthdate: data.birthdate ? data.birthdate.slice(0, 10) : '',
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
          <Pressable onPress={selectImage}>
            <IconProfile
              size={80}
              letter={letter}
              image={image}
            />
          </Pressable>
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
      <View style={{ height: 100, width: "100%" }} />
    </ThemedView>
  );
}

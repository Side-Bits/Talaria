import { router } from 'expo-router';
import { View, Pressable, StyleSheet, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormDate } from '@/components/FormDate';
import { FormInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { createTravel, getTravel } from '@/services/api/travel';
import { travelSchema } from '@/schemas/travel.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Participants } from '@/components/Participants';
import { Colors } from '@/constants/Colors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isImageAsset, setImageBase64, useImagePicker } from '@/scripts/ImageScripts';
import type { DocumentPickerAsset } from 'expo-document-picker';
import { useToast } from '@/hooks/useToast';
import { useFooterAction } from '@/contexts/footerActionsContext';

export function setImage(asset: DocumentPickerAsset | null) {
    if (!asset) {
        return (
            <ThemedView type='center' style={{ flex: 1 }}>
                <ThemedText type='default' textMuted={true}>Add front page</ThemedText>
            </ThemedView>
        );
    }

    return (
        <Image
            source={{ uri: asset.uri }}
            style={styles.preview}
            resizeMode='cover'
        />
    );
}

export function TravelEditorScreen({ travel_id }: { travel_id?: string }) {
    const {
        control,
        handleSubmit,
        trigger,
        reset,
        setValue,
        formState: { isSubmitting },
    } = useForm<z.input<typeof travelSchema>>({
        resolver: zodResolver(travelSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: true,
        defaultValues: DEFAULT_TRAVEL,
    });

    const [travel, setTravel] = useState<Travel>();
    const { image, selectImage: pickImage } = useImagePicker();
    const { showToast } = useToast();

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

            setValue('image', base64);
        } catch (error) {
            showToast({
                title: 'Error',
                message: 'Could not process the selected image',
                variant: 'error',
            });
        }
    };

    useEffect(() => {
        if (!travel_id) {
            reset(DEFAULT_TRAVEL);
            setTravel(undefined);
            return;
        }

        getTravel(travel_id)
            .then((data) => {
                setTravel(data);
                reset(data);
            })
            .catch((error) => console.error(error));
    }, [travel_id, reset]);

    const handleTravel = useCallback(async (travel: Travel) => {
        try {
            await createTravel(travel)
            router.back();
        } catch (error) {
            // console.error('Failed to create the travel:', error);
            showToast({
                title: 'Error',
                message: 'Could not create the travel',
                variant: 'error',
            });
        }
    }, [showToast]);

    const submitTravel = useMemo(
        () => handleSubmit(handleTravel),
        [handleSubmit, handleTravel],
    );

    useFooterAction({
        title: "Add",
        id: "buttonAdd",
        onPress: submitTravel,
        disabled: isSubmitting,
        loading: isSubmitting,
    });

    return (
        <ThemedView type='left'>
            <Header
                button_back={true}
                label={!travel_id ? 'Create trip' : travel?.name ?? " "}
            />
            <ThemedView type='left' style={{ width: '100%' }}>
                <Pressable style={styles.hero} onPress={ selectImage }>
                    {setImage(image)}
                </Pressable>
                <FormInput
                    control={control}
                    trigger={trigger}
                    name='name'
                    type='text'
                    label='Travel name'
                    required
                    disabled={isSubmitting}
                />
                <ThemedView type='between' style={{ width: '100%' }}>
                    <View style={{ flex: 1 }}>
                        <FormDate
                            control={control}
                            trigger={trigger}
                            name='start_date'
                            label='Start date'
                            required
                            disabled={isSubmitting}
                        />
                    </View>
                    <ThemedText type="center" style={{ marginHorizontal: 12, marginTop: 8 }}>to</ThemedText>
                    <View style={{ flex: 1 }}>
                        <FormDate
                            control={control}
                            trigger={trigger}
                            name='end_date'
                            label='End date'
                            required
                            disabled={isSubmitting}
                        />
                    </View>
                </ThemedView>
                <FormInput
                    control={control}
                    trigger={trigger}
                    name='description'
                    type='text'
                    label='Description'
                    multiline
                    numberOfLines={4}
                    textAlignVertical='top'
                    controlStyle={{
                        alignItems: 'flex-start',
                        minHeight: 96,
                        paddingVertical: 8,
                    }}
                    inputStyle={{ minHeight: 80, paddingTop: 4 }}
                    disabled={isSubmitting}
                />
                <View style={{ width: '100%', marginBottom: 12, }}>
                    <ThemedText type="small" textMuted={true} style={{ marginBottom: 6, width: '100%' }}>People</ThemedText>
                    <Participants
                        editable={true}
                        size={40}
                        data={{}}
                    />
                </View>
            </ThemedView>
            <View style={{ height: 103, width: '100%' }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    hero: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: '#FCFCFC',
        overflow: 'hidden',
    },
    preview: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    }
});

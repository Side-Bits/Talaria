import { router } from 'expo-router';
import { View, Alert, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormDate } from '@/components/FormDate';
import { FormInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { createTravel, getTravel } from '@/services/api/travel';
import { travelSchema } from '@/schemas/travel.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Participants } from '@/components/Participants';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';

export function TravelEditorScreen({ travel_id }: { travel_id?: string }) {
    const {
        control,
        handleSubmit,
        trigger,
        reset,
        formState: { isSubmitting },
    } = useForm<z.input<typeof travelSchema>>({
        resolver: zodResolver(travelSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        defaultValues: DEFAULT_TRAVEL,
    });

    const [travel, setTravel] = useState<Travel>();

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

    const handleTravel = async (travel: Travel) => {
        try {
            await createTravel(travel)
            router.back();
        } catch {
            Alert.alert('Error', 'Invalid credentials');
        }
    };

    return (
        <ThemedView type='left'>
            <Header code='004' label={!travel_id ? 'New trip' : travel?.name ?? ""} />
            <ThemedView type='left' style={{ width: '100%' }}>
                <Pressable style={styles.hero}>
                    <ThemedView type='center'>
                        <ThemedText type='default' style={{ color: Colors.light.textMuted }}>Add front page</ThemedText>
                    </ThemedView>
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
                    <ThemedText type="center" style={{ marginHorizontal: 12, marginBottom: 8 }}>a</ThemedText>
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
                    <ThemedText type="small" muted={true} style={{ marginBottom: 6, width: '100%' }}>People</ThemedText>
                    <Participants
                        size={40}
                        data={{
                            1: { id_client: 1, username: 'miquel', background: '#0d0d0d' },
                            2: { id_client: 2, username: 'gerard', background: '#f78383' },
                        }}
                    />
                </View>
                <ThemedButton
                    title='Add'
                    buttonStyle={{ marginTop: 12 }}
                    onPress={handleSubmit(handleTravel)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
            </ThemedView>
            <View style={{ height: 115, width: '100%' }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    hero: {
        width: '100%',
        minHeight: 100,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderStyle: 'dashed',
    }
});

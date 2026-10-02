import { router, useLocalSearchParams } from 'expo-router';
import { View, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FormDate } from '@/components/FormDate';
import { FormInput } from '@/components/FormInput';
import { Header } from '@/components/Header';
import { ThemedButton } from '@/components/ThemedButton';
import { DEFAULT_TRAVEL, Travel } from '@/types/travel';
import { createTravel } from '@/services/api/travel';
import { travelSchema } from '@/schemas/travel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function TravelDetailsScreen() {
    const { mode } = useLocalSearchParams();
    const {
        control,
        handleSubmit,
        trigger,
        formState: { isSubmitting },
    } = useForm<z.input<typeof travelSchema>>({
        resolver: zodResolver(travelSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        defaultValues: DEFAULT_TRAVEL,
    });

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
            <Header code='004' label={mode === 'C' ? 'New trip' : 'Trip details'} />
            <ThemedView type='left' style={{ width: '100%' }}>
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
                    <View style={{ width: 40 }}><ThemedText type='center'>a</ThemedText></View>
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
                <ThemedInput type='textarea' label='Description' value={travel.description} onChangeText={text => setTravel({ ...travel, description: text })} />
                <ThemedButton
                    title='Add'
                    style={{ marginTop: 8 }}
                    onPress={handleSubmit(handleTravel)}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                {/* <ThemedView type='left'>
          <Text style={{ marginBottom: 4, fontSize: 12, color: Colors.light.onSurface }}>Participants</Text>
          <Participants size={40} gap={4} />
        </ThemedView> */}
            </ThemedView>
            <View style={{ height: 115, width: '100%' }} />
        </ThemedView>
    );
>>>>>>> 07ff980 (feat: add validated auth and travel forms)
}

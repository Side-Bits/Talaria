import React from "react";

import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/Header';
import { router, useLocalSearchParams } from 'expo-router';
import { IconCategory } from '@/components/IconCategory';
import { Participants } from '@/components/Participants';
import { deleteActivity } from "@/services/api/activity";
import { formatActivityDates } from "@/scripts/DataScripts";
import { Colors } from "@/constants/Colors";
import { ErrorCard } from "@/components/ErrorCard";
import { useActivity } from "@/hooks/useActivity";
import { globalStyles } from "@/constants/Global";

export function ActivityDetailsScreen() {
    const { travel_id, activity_id, name } = useLocalSearchParams();
    const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
    const activityId = Array.isArray(activity_id) ? activity_id[0] : activity_id;
    const activityName = Array.isArray(name) ? name[0] : name;

    const { state, retry } = useActivity(travelId, activityId);

    const handleActivity = async () => {
        if (!travelId || !activityId) return;

        try {
            await deleteActivity(travelId, activityId);
            router.back();
        } catch {
            Alert.alert("Error", "Invalid credentials");
        }
    }

    return (
        <ThemedView type='left'>
            <Header 
                button_back={true}
                popover={{
                    delete: {
                        icon: 'trash-outline',
                        option: 'Delete activity',
                        color: 'red',
                        onclick: () => handleActivity(),
                    },
                }}
                label={activityName}
            />
            {state.status === 'loading' ? (
                <View style={styles.feedback}>
                    <ActivityIndicator color={Colors.light.primary} />
                </View>
            ) : state.status === 'error' ? (
                <ErrorCard
                    title="We couldn't load the activity"
                    description={state.error.message}
                    image={require('../../assets/images/failed.png')}
                    onPress={retry}
                />
            ) : (
                <>
                    <ThemedView type='left' style={{ width: '100%' }}>
                        <ThemedView type='left' margin={16} style={{ alignItems: 'center' }}>
                            <IconCategory size={80} />
                        </ThemedView>
                        <ThemedText style={styles.description} textMuted={true}>{state.data.description}</ThemedText>
                        <ThemedText type="underlined">Information</ThemedText>
                        <ThemedView type='list' margin={8} style={globalStyles.simpleContainer}>
                            <ThemedView type='between' margin={8}>
                                <ThemedText type='small' textMuted={true}>Date</ThemedText>
                                <ThemedText type='small'>{formatActivityDates(state.data.start_date, state.data.end_date)}</ThemedText>
                            </ThemedView>
                            <ThemedView type='between' margin={8}>
                                <ThemedText type='small' textMuted={true}>Location</ThemedText>
                                <ThemedText type='small'>{state.data.location}</ThemedText>
                            </ThemedView>
                            <ThemedView type='between'>
                                <ThemedText type='small' textMuted={true}>Total price</ThemedText>
                                <ThemedText type='small'>{state.data.price}</ThemedText>
                            </ThemedView>
                        </ThemedView>
                        <View style={{ width: '100%', marginBottom: 12, }}>
                            <ThemedText type="underlined">People</ThemedText>
                            <Participants
                                editable={false}
                                size={40}
                                data={{}}
                            />
                        </View>
                        {/*<View style={{ width: '100%', marginBottom: 12, }}>
                            <ThemedText type="underlined">Others</ThemedText>
                        </View>
                        <View style={{ width: '100%', marginBottom: 12, }}>
                            <ThemedText type="underlined">Documents</ThemedText>
                        </View>*/}
                    </ThemedView>
                    <View style={{ height: 103, width: '100%' }} />
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    description: {
        marginBottom: 16
    },
    feedback: {
        width: '100%',
        paddingVertical: 16,
    },
})

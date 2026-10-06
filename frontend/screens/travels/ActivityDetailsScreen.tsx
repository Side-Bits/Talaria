import React, { useEffect, useState } from "react";

import { View, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Header } from '@/components/Header';
import { Activity, DEFAULT_ACTIVITY } from '@/types/activity';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from "@/constants/Colors";
import { IconCategory } from '@/components/IconCategory';
import { Participants } from '@/components/Participants';
import { getTravelActivity } from "@/services/api/activity";

export function ActivityDetailsScreen() {
    const { travel_id, activity_id } = useLocalSearchParams();
    const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
    const activityId = Array.isArray(activity_id) ? activity_id[0] : activity_id;

    const [activity, setActivity] = useState<Activity>(DEFAULT_ACTIVITY);

    useEffect(() => {
        if (!travelId || !activityId) return;

        getTravelActivity(travelId, activityId)
            .then(data => setActivity(data))
            .catch(e => {
                console.error(e);
                Alert.alert('Error', 'Failed to fetch activity');
            });
    }, [travelId, activityId]);

    return (
        <ThemedView type='left'>
            <Header code='003' label={activity.name} />
            <ThemedView type='left' style={{ width: '100%' }}>
                <ThemedView type='left' margin={16} style={{ alignItems: 'center' }}>
                    <IconCategory size={80} />
                </ThemedView>
                <ThemedText style={styles.description}>{activity.description}</ThemedText>
                <ThemedText type="underlined">Information</ThemedText>
                <ThemedView type='list' margin={8} style={styles.container}>
                    <ThemedView type='between' margin={8}>
                        <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Location</ThemedText>
                        <ThemedText type='small'>{activity.location}</ThemedText>
                    </ThemedView>
                    <ThemedView type='between'>
                        <ThemedText type='small' style={{ color: Colors.light.textMuted }}>Total price</ThemedText>
                        <ThemedText type='small'>{activity.price}</ThemedText>
                    </ThemedView>
                </ThemedView>
                <View style={{ width: '100%', marginBottom: 12, }}>
                    <ThemedText type="underlined">People</ThemedText>
                    <Participants
                        size={40}
                        data={{
                            1: { id_client: 1, username: 'miquel', background: '#0d0d0d' },
                            2: { id_client: 2, username: 'gerard', background: '#f78383' },
                        }}
                    />
                </View>
                <View style={{ width: '100%', marginBottom: 12, }}>
                    <ThemedText type="underlined">Others</ThemedText>
                </View>
                <View style={{ width: '100%', marginBottom: 12, }}>
                    <ThemedText type="underlined">Documents</ThemedText>
                </View>
            </ThemedView>
            <View style={{ height: 115, width: '100%' }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    description: {
        color: Colors.light.textMuted,
        marginBottom: 16
    }, container: {
        width: '100%',
        padding: 8,
        backgroundColor: '#FBFBFB',
        borderRadius: 4
    }
})

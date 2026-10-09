import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "@/components/Header";
import { getTravelActivities } from "@/services/api/activity";
import { Activity } from "@/types/activity";
import { Tabs } from "@/components/Tabs";
import { HeroActivity } from "./components/HeroActivity";
import { ActivityCard } from "./components/ActivityCard";
import { Participants } from "@/components/Participants";
import { Colors } from "@/constants/Colors";

export function ActivitiesDetailsScreen() {
    const { travel_id, name, date, description, image } = useLocalSearchParams();
    const travelId = Array.isArray(travel_id) ? travel_id[0] : travel_id;
    const travelImage = Array.isArray(image) ? image[0] : image;
    const [activity, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if (!travelId) return;
        getTravelActivities(travelId)
            .then((data) =>
                Array.isArray(data) ? setActivities(data) : setActivities([]),
            )
            .catch((e) => console.error("Failed to fetch activities", e));
    }, [travelId]);

    const handlePressCreateActivity = () => {
        router.push({
            pathname: "/(app)/travels/[travel_id]/activities/create",
            params: { travel_id: travelId },
        });
    };

    return (
        <ThemedView type="left" style={{ marginBottom: 64 }}>
            <Header
                button_back={true}
                button_menu={true}
                label={String(name)}
            />
            <HeroActivity image={travelImage} />
            <ThemedView type='between' style={{ marginBottom: 8 }}>
                <ThemedText>{date}</ThemedText>
                <Participants
                    editable={false}
                    size={25}
                    data={{}}
                />
            </ThemedView>
            <ThemedText style={styles.description}>{description}</ThemedText>
            {activity.length ? (
                <>
                    <ThemedText type="underlined">Activities</ThemedText>
                    <Tabs
                        data={{
                            all: { label: "All", onPress: () => console.log('All') },
                            d1: { label: "Day 1", onPress: () => console.log('Day 1') },
                            d2: { label: "Day 2", onPress: () => console.log('Day 2') }
                        }}
                        scroll={true}
                    />
                </>
            ) : (
                <Pressable
                    style={styles.create}
                    onPress={handlePressCreateActivity}
                >
                    <ThemedView type='center'>
                        <ThemedText type='default' style={{ color: Colors.light.textMuted }}>Create an activity</ThemedText>
                    </ThemedView>
                </Pressable>
            )}
            <ThemedView type="left" style={{ width: "100%" }}>
                {activity.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                ))}
            </ThemedView>
            <View style={{ height: 115, width: "100%" }} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    description: {
        color: Colors.light.textMuted,
        marginBottom: 16
    },
    create: {
        width: '100%',
        minHeight: 45,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: '#fcfcfc',
        borderStyle: 'dashed',
    }
});
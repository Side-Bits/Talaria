import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Travel } from "@/types/travel";
import { useRouter } from "expo-router";
import { formatTravelDates } from "@/scripts/DataScripts";
import { getImageBase64 } from "@/scripts/ImageScripts";

type TravelCardProps = {
    travel: Travel;
    onPress?: () => void;
};

export function TravelCard({ travel, onPress }: TravelCardProps) {
    const router = useRouter();
    const date = formatTravelDates(travel.start_date, travel.end_date);

    const handlePress =
        onPress ??
        (() =>
            router.push({
                pathname: "/(app)/travels/[travel_id]/activities",
                params: {
                    travel_id: travel.id,
                    name: travel.name
                },
            }));

    const content = (
        <ThemedView type="list" style={styles.content}>
            <ThemedText
                type="default"
                style={[styles.name, travel.image && styles.textOnImage]}
            >
                {travel.name}
            </ThemedText>
            <ThemedText type="default" style={travel.image && styles.textOnImage}>
                {date}
            </ThemedText>
        </ThemedView>
    );

    return (
        <Pressable
            style={[styles.container, !travel.image && styles.noImage]}
            onPress={handlePress}
        >
            {travel.image ? (
                <ImageBackground
                    source={{ uri: getImageBase64(travel.image) }}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <LinearGradient
                        colors={[
                            "rgba(0,0,0,0.60)",
                            "rgba(0,0,0,0.55)",
                            "rgba(0,0,0,0.50)",
                            "rgba(0,0,0,0.45)",
                            "rgba(0,0,0,0.40)",
                            "rgba(0,0,0,0.25)",
                            "rgba(0,0,0,0)",
                        ]}
                        locations={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.overlay}>{content}</View>
                </ImageBackground>
            ) : (
                content
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        width: "100%",
        borderRadius: 8,
        marginBottom: 8,
    },
    noImage: {
        backgroundColor: "#FBFBFB",
        padding: 8,
    },
    image: {
        width: "100%",
        height: 64,
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 12,
    },
    content: {
        backgroundColor: "transparent",
    },
    name: {
        fontSize: 16,
        marginBottom: 2,
    },
    textOnImage: {
        color: "#fff",
    },
});

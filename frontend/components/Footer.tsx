import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, useGlobalSearchParams, useSegments } from "expo-router";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
    resolveFooterNavigation,
    type FooterDestination,
    type FooterParams,
    type FooterTab,
} from "@/navigation/footer";

const TAB_ICONS: Record<
    FooterTab,
    {
        name: ComponentProps<typeof Ionicons>["name"];
        size: number;
    }
> = {
    home: { name: "home-outline", size: 20 },
    trip: { name: "navigate-outline", size: 25 },
    create: { name: "add-outline", size: 25 },
    profile: { name: "person-outline", size: 20 },
};

export function Footer() {
    const segments = useSegments();
    const params = useGlobalSearchParams<FooterParams>();
    const { activeTab, destinations } = resolveFooterNavigation(segments, params);

    return (
        <View style={styles.footer}>
            <ThemedView type="between" style={styles.container}>
                {destinations.map((destination) => (
                    <FooterButton
                        key={destination.id}
                        destination={destination}
                        isActive={destination.id === activeTab}
                    />
                ))}
            </ThemedView>
        </View>
    );
}

function FooterButton({
    destination,
    isActive,
} : {
    destination: FooterDestination;
    isActive: boolean;
}) {
    const icon = TAB_ICONS[destination.id];

    const handlePress = () => {
        if (destination.isCurrentScreen) return;
        router[destination.method](destination.href);
    };

    return (
        <Pressable
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={destination.label}
            accessibilityState={{ selected: isActive }}
            style={[styles.box, isActive ? styles.active : styles.inactive]}
        >
            <ThemedView type="center" style={styles.item}>
                <Ionicons
                    name={icon.name}
                    size={icon.size}
                    color={isActive ? Colors.light.surface : Colors.light.textMuted}
                />
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    footer: {
        position: "absolute",
        width: "100%",
        maxWidth: 450,
        alignItems: "center",
        bottom: 0,
        paddingBottom: 32,
        paddingHorizontal: 16,
        backgroundColor: "transparent",
    },
    container: {
        width: "100%",
        maxWidth: 450,
        padding: 6,
        gap: 6,
        borderRadius: 24,
        alignItems: "stretch",
        backgroundColor: "#F5F5F7",
    },
    box: {
        flex: 1,
        borderRadius: 18,
    },
    inactive: {
        backgroundColor: "transparent",
    },
    active: {
        backgroundColor: Colors.light.onBackground,
    },
    item: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        height: "100%",
        padding: 8,
    },
});

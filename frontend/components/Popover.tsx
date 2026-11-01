import { ComponentProps } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export type PopoverItem = {
    icon: ComponentProps<typeof Ionicons>['name'];
    option: string;
    color?: string;
    onclick: () => void;
};

type Props = {
    data: Record<string, PopoverItem>;
};

export function Popover({ data }: Props) {
    return (
      <ThemedView type='column' style={[styles.popover, { width: 160 }]}>
        {Object.entries(data).map(([key, element]) => (
            <Pressable
                key={key}
                style={styles.option}
                onPress={element.onclick}
            >
                <Ionicons name={element.icon} size={20} color={element.color ?? Colors.light.onSurface} />
                <ThemedText>{element.option}</ThemedText>
            </Pressable>
        ))}
      </ThemedView>  
    );
}

const styles = StyleSheet.create({
    popover: {
        position: 'absolute',
        top: 70,
        right: 0,
        flex: 0,
        alignItems: 'stretch',
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: Colors.light.surface,
        borderWidth: 1,
        borderColor: Colors.light.border,
        zIndex: 888,
        elevation: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    }
});
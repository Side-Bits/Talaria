import React from 'react';
import { Colors } from '@/constants/Colors';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = & {
    label: string;
};

export function ThemedCheckbox({ label, ...rest }: Props) {
    return <View>
        <ThemedText>Remember me</ThemedText>
    </View>
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.tint,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
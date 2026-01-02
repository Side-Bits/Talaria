import React, { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Checkbox } from 'expo-checkbox';

type Props = & {
    label: string;
};

export function ThemedCheckbox({ label, ...rest }: Props) {
    const [isChecked, setChecked] = useState(false);

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox style={{ marginRight: 4 }} value={isChecked} onValueChange={setChecked} />
        <ThemedText>{label}</ThemedText>
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
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, TextInput, StyleSheet, View, TextInputProps } from 'react-native';

type Props = TextInputProps & {
    type: 'text' | 'password' | 'email' | 'date';
    label: string;
};

export function ThemedInput({ label, type, ...rest }: Props) {
    return (
        <View style={styles.view}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input}
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
        marginBottom: 8,
    },
    label: {
        marginBottom: 4,
        fontSize: 12,
        color: Colors.light.text,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: 12,
        padding: 8,
        fontSize: 12,
    },
})

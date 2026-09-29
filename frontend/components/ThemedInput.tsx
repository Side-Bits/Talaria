import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text, TextInput, StyleSheet, View, TextInputProps } from 'react-native';

type Props = TextInputProps & {
    type: 'text' | 'password' | 'email' | 'textarea';
    label: string;
};

export function ThemedInput({ label, type, ...rest }: Props) {
    return (
        <View style={styles.view}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={type === 'textarea' ? [styles.textinput, styles.textarea] : styles.textinput}
                secureTextEntry={type === 'password'}
                multiline={type === 'textarea'}
                textAlignVertical={type === 'textarea' ? 'top' : undefined}
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
        color: Colors.light.textMuted,
    },
    textinput: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.onPrimary,
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
    },
    textarea: {
        height: 64,
    }
})

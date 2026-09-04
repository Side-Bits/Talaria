import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, StyleSheet, View, TextInputProps } from 'react-native';
import { ThemedView } from './ThemedView';

type Props = TextInputProps & {
    label: string;
    date: boolean;
    mode: string;
    value: string;
    onChangeText: (value: string) => void;
};

export function ThemedDate ({ label, date, mode, value, onChangeText, onBlur, ...rest }: Props) {
    const [datePart, setDatePart] = useState(date ? value : (value?.split('T')[0] || ''));
    const [timePart, setTimePart] = useState(date ? '' : (value?.split('T')[1]?.slice(0, 5) || ''));

    // It is used to prevent it from providing the default information
    useEffect(() => {
        setDatePart(date ? value : (value?.split('T')[0] || ''));
        setTimePart(date ? '' : (value?.split('T')[1]?.slice(0, 5) || ''));
    }, [date, value]);

    const handleDate = (newDate: string) => {
        if (date) {
            // YYYY-MM-DD
            onChangeText(newDate);
        } else {
            setDatePart(newDate);
        }
    };

    const handleTime = (newTime: string) => {
        setTimePart(newTime);
    };

    const handleDateBlur = (event: Parameters<NonNullable<Props['onBlur']>>[0]) => {
        onChangeText(`${datePart}T${timePart || '00:00'}:00Z`);
        onBlur?.(event);
    };

    const handleTimeBlur = (event: Parameters<NonNullable<Props['onBlur']>>[0]) => {
        onChangeText(`${datePart}T${timePart || '00:00'}:00Z`);
        onBlur?.(event);
    };

    return (
        <View style={styles.view}>
            <Text style={styles.label}>{label}</Text>
            {
                date ? (
                    <TextInput style={styles.input} value={datePart} onChangeText={handleDate} maxLength={10}
                        {...rest}
                    />
                ) : (
                    <ThemedView type='between'>
                        <TextInput style={[ styles.input, { flex: 1, maxWidth: 90, marginRight: 2 } ]} value={datePart} onChangeText={handleDate} onBlur={handleDateBlur} maxLength={10}
                            {...rest}
                        />
                        <TextInput style={[ styles.input, { maxWidth: 50, marginLeft: 2 } ]} value={timePart} onChangeText={handleTime} onBlur={handleTimeBlur} maxLength={5}
                            {...rest}
                        />
                    </ThemedView>
                )
            }
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
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        backgroundColor: Colors.light.onPrimary,
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
    },
})

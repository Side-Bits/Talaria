import React, { useState } from 'react';
import { View } from 'react-native';
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

import { Colors } from '@/constants/Colors';
import { PressableProps, Pressable, Text, StyleSheet, TextStyle } from 'react-native';
import { ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type ThemedButtonProps = PressableProps & {
    title: string;
    buttonStyle?: ViewStyle;
    textStyle?: TextStyle;
};

export function ThemedButton({ title, buttonStyle, textStyle, ...others }: ThemedButtonProps
) {
    return (
        <Pressable {...others} style={[styles.button, buttonStyle]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
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

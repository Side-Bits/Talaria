import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    simpleContainer: {
        width: '100%',
        padding: 8,
        backgroundColor: '#FCFCFC',
        borderRadius: 4
    }
});
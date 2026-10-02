import { forwardRef, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import {
    TextInputField,
    type TextInputFieldProps,
} from "@/components/TextInputField";
import { Colors } from "@/constants/Colors";

const DATE_PLACEHOLDER = "DD/MM/YYYY";
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/; // YYYY-MM-DD

/** Indica si un año es bisiesto */
function isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** Devuelve el número de días del mes o cero si el mes no existe. */
function daysInMonth(month: number, year: number) {
    const days = [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
    return days[month - 1] ?? 0;
}

/** Comprueba que la fecha sea valida */
function isValidDate(day: number, month: number, year: number) {
    return (
        year >= 1 && year <= 9999 && day >= 1 && day <= daysInMonth(month, year)
    );
}

/**
 * Elimina caracteres no numéricos y añade los separadores (DD/MM/AAAA) mientras escribe
 */
function formatTypedDate(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4, 8);

    return [day, month, year].filter(Boolean).join("/");
}

/**
 * Convierte una fecha valida de `DD/MM/AAAA` a `AAAA-MM-DD`.
 * Devuelve `null` cuando la fecha está incompleta
 */
function displayToIso(value: string) {
    const [dayText, monthText, yearText] = value.split("/");

    if (
        dayText?.length !== 2 ||
        monthText?.length !== 2 ||
        yearText?.length !== 4
    ) {
        return null;
    }

    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);

    if (!isValidDate(day, month, year)) {
        return null;
    }

    return `${yearText}-${monthText}-${dayText}`;
}

/**
 * Convierte una fecha ISO válida al formato visible
 */
function isoToDisplay(value: string) {
    const match = ISO_DATE_PATTERN.exec(value);

    if (!match) {
        return value;
    }

    const [, yearText, monthText, dayText] = match;
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);

    return isValidDate(day, month, year)
        ? `${dayText}/${monthText}/${yearText}`
        : value;
}

/** Props */
export type ThemedDateProps = Omit<
    TextInputFieldProps,
    | "inputMode"
    | "keyboardType"
    | "maxLength"
    | "onChangeText"
    | "type"
    | "value"
> & {
    /** Fecha ISO (`AAAA-MM-DD`) o valor visible todavía incompleto */
    value?: string;
    /**
     * Fecha ISO cuando el valor es válido. Mientras la edición esté
     * incompleta, recibe el texto en formato `DD/MM/AAAA`.
     */
    onChangeText: (value: string) => void;
};

/**
 * Campo controlado para introducir fechas exclusivamente mediante el teclado.
 *
 * Presenta la fecha como `DD/MM/AAAA`, añade las barras automáticamente y
 * valida tanto el número de días de cada mes como los años bisiestos. Cuando
 * la fecha es válida, `onChangeText` devuelve el formato ISO `AAAA-MM-DD` para
 * el backend.
 *
 * @example
 * ```tsx
 * <ThemedDate
 *   label="Fecha de inicio"
 *   value={startDate}
 *   onChangeText={setStartDate}
 *   required
 * />
 * ```
 */
export const ThemedDate = forwardRef<TextInput, ThemedDateProps>(
    function ThemedDate(
        {
            controlStyle,
            helperText = DATE_PLACEHOLDER,
            inputStyle,
            label,
            onChangeText,
            placeholder = DATE_PLACEHOLDER,
            value = "",
            ...inputProps
        },
        ref,
    ) {
        const [displayValue, setDisplayValue] = useState(() =>
            isoToDisplay(value),
        );

        useEffect(() => {
            setDisplayValue(isoToDisplay(value));
        }, [value]);

        const handleChange = (text: string) => {
            const isoMatch = ISO_DATE_PATTERN.exec(text);
            const nextDisplay = isoMatch
                ? isoToDisplay(text)
                : formatTypedDate(text);
            const isoValue = displayToIso(nextDisplay);

            setDisplayValue(nextDisplay);
            onChangeText(isoValue ?? nextDisplay);
        };

        return (
            <TextInputField
                {...inputProps}
                leadingIcon={"calendar-outline"}
                autoComplete="off"
                clearable={false}
                controlStyle={[styles.control, controlStyle]}
                helperText={helperText}
                inputMode="numeric"
                inputStyle={[styles.input, inputStyle]}
                keyboardType="number-pad"
                label={label}
                maxLength={10}
                onChangeText={handleChange}
                placeholder={placeholder}
                ref={ref}
                type="text"
                value={displayValue}
            />
        );
    },
);

const styles = StyleSheet.create({
    control: {
        backgroundColor: Colors.light.surface,
        minHeight: 44,
        paddingHorizontal: 4,
    },
    input: {
        fontSize: 14,
        paddingHorizontal: 2,
        paddingVertical: 6,
    },
});

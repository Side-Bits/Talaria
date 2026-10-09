import { forwardRef, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import {
    TextInputField,
    type TextInputFieldProps,
} from "@/components/TextInputField";
import { Colors } from "@/constants/Colors";

const DATE_PLACEHOLDER = "DD/MM/YYYY";
const DATETIME_PLACEHOLDER = "DD/MM/YYYY HH:mm";
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/; // YYYY-MM-DD
const ISO_DATETIME_PATTERN =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?Z$/;

export type ThemedDateMode = "date" | "datetime";

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

function formatTypedDateTime(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    const dateDigits = digits.slice(0, 8);
    const timeDigits = digits.slice(8, 12);
    const date = [
        dateDigits.slice(0, 2),
        dateDigits.slice(2, 4),
        dateDigits.slice(4, 8),
    ]
        .filter(Boolean)
        .join("/");
    const time = [timeDigits.slice(0, 2), timeDigits.slice(2, 4)]
        .filter(Boolean)
        .join(":");

    return [date, time].filter(Boolean).join(" ");
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

function displayToIsoDateTime(value: string) {
    const [dateText, timeText] = value.split(" ");
    const date = displayToIso(dateText ?? "");
    const [hourText, minuteText] = (timeText ?? "").split(":");

    if (
        !date ||
        hourText?.length !== 2 ||
        minuteText?.length !== 2 ||
        Number(hourText) > 23 ||
        Number(minuteText) > 59
    ) {
        return null;
    }

    return `${date}T${hourText}:${minuteText}:00Z`;
}

/**
 * Convierte una fecha ISO válida al formato visible
 */
function isoToDisplay(value: string, mode: ThemedDateMode) {
    if (mode === "datetime") {
        const match = ISO_DATETIME_PATTERN.exec(value);

        if (!match) {
            return value;
        }

        const [, yearText, monthText, dayText, hourText, minuteText] = match;
        const day = Number(dayText);
        const month = Number(monthText);
        const year = Number(yearText);
        const hour = Number(hourText);
        const minute = Number(minuteText);

        return isValidDate(day, month, year) && hour <= 23 && minute <= 59
            ? `${dayText}/${monthText}/${yearText} ${hourText}:${minuteText}`
            : value;
    }

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
    /** Fecha simple o fecha y hora en formato UTC, según el modo seleccionado. */
    mode?: ThemedDateMode;
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
            helperText,
            inputStyle,
            label,
            mode = "date",
            onChangeText,
            placeholder,
            value = "",
            ...inputProps
        },
        ref,
    ) {
        const [displayValue, setDisplayValue] = useState(() =>
            isoToDisplay(value, mode),
        );

        useEffect(() => {
            setDisplayValue(isoToDisplay(value, mode));
        }, [mode, value]);

        const handleChange = (text: string) => {
            const isoMatch = ISO_DATE_PATTERN.exec(text);
            const nextDisplay = isoMatch
                ? isoToDisplay(text, mode)
                : mode === "datetime"
                  ? formatTypedDateTime(text)
                  : formatTypedDate(text);
            const isoValue =
                mode === "datetime"
                    ? displayToIsoDateTime(nextDisplay)
                    : displayToIso(nextDisplay);

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
                helperText={helperText ?? (mode === "datetime" ? DATETIME_PLACEHOLDER : DATE_PLACEHOLDER)}
                inputMode="numeric"
                inputStyle={[styles.input, inputStyle]}
                keyboardType="number-pad"
                label={label}
                maxLength={mode === "datetime" ? 16 : 10}
                onChangeText={handleChange}
                placeholder={placeholder ?? (mode === "datetime" ? DATETIME_PLACEHOLDER : DATE_PLACEHOLDER)}
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

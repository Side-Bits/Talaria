import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormTrigger,
} from "react-hook-form";

import {
  ThemedDate,
  type ThemedDateProps,
} from "@/components/ThemedDate";

export type FormDateProps<T extends FieldValues> = Omit<
  ThemedDateProps,
  "value" | "error" | "onChangeText"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  trigger?: UseFormTrigger<T>;
};

export function FormDate<T extends FieldValues>({
  control,
  name,
  trigger,
  ...inputProps
}: FormDateProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <ThemedDate
          {...inputProps}
          value={field.value ?? ""}
          error={fieldState.error?.message}
          ref={field.ref}
          onBlur={field.onBlur}
          onChangeText={(value) => {
            field.onChange(value);

            // Once an error is visible, keep it in sync while the user types.
            if (fieldState.error) {
              void trigger?.(name);
            }
          }}
        />
      )}
    />
  );
}

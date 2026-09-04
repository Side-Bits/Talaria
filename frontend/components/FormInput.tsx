import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type UseFormTrigger,
} from "react-hook-form";

import {
  TextInputField,
  type TextInputFieldProps,
} from "@/components/TextInputField";

export type FormInputProps<T extends FieldValues> = Omit<
  TextInputFieldProps,
  "value" | "defaultValue" | "error" | "onChangeText"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  trigger?: UseFormTrigger<T>;
};

export function FormInput<T extends FieldValues>({
  control,
  name,
  trigger,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextInputField
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

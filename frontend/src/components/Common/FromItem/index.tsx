import React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import Text from "../Text";
import { Checkbox } from "antd";

interface FormItemProps<TFieldValues extends FieldValues = FieldValues> {
  label?: string;
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  children: React.ReactElement;
  [key: string]: unknown;
}

const FormItem = <TFieldValues extends FieldValues = FieldValues>({
  label,
  control,
  name,
  children,
  ...rest
}: FormItemProps<TFieldValues>) => {
  const errors = control?._formState?.errors;
  const isError = errors && errors[name] && errors[name]?.message;
  const errorMessage = errors?.[name]?.message as string;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const childProps = {
          ...rest,
          ...(isError && { error: isError }),
        };

        if (
          children.type?.displayName === "Checkbox" ||
          children.type?.name === "Checkbox"
        ) {
          return React.cloneElement(children, {
            ...childProps,
            checked: field.value ?? false,
            onChange: (e: any) => field.onChange(e.target.checked),
            onBlur: field.onBlur,
            ref: field.ref,
          });
        }

        return (
          <div>
            {label && <Text isLabel>{label}</Text>}
            {React.cloneElement(children, {
              ...field,
              ...childProps,
            })}

            {isError && errorMessage && (
              <Text size="semi-small" color="error">
                {errorMessage}
              </Text>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormItem;

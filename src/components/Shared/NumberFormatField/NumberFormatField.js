import React from "react";

import { Controller, useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import NumberFormat from "react-number-format";

const NumberFormatDocument = ({
  control,
  isRequired,
  nameField,
  labelField,
  defaultValue,
}) => {
  const {
    formState: { errors },
  } = useForm();
  return (
    <Controller
      rules={{ required: isRequired }}
      control={control}
      name={nameField}
      error={errors?.[nameField]}
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...field}
          error={errors?.[nameField]}
          variant="outlined"
          label={labelField}
          autoFocus
          InputLabelProps={{ shrink: true }}
          InputProps={{
            inputComponent: React.forwardRef((props) => {
              return (
                <NumberFormat
                  {...props}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  thousandSeparator
                  prefix="$"
                />
              );
            }),
          }}
        />
      )}
    />
  );
};

export default NumberFormatDocument;

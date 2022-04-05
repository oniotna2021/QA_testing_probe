import React from "react";

import { Controller } from "react-hook-form";

// UI
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";

const SelectFilter = ({ items, label, onChange, type, control }) => {
  return (
    <Controller
      name={type}
      control={control}
      defaultValue={""}
      render={({ field }) => (
        <FormControl style={{ position: "relative" }}>
          <InputLabel>{label}</InputLabel>
          <Select
            {...field}
            label={label}
            displayEmpty
            onChange={(e) => {
              field.onChange(e.target.value);
              onChange(e, type);
            }}
          >
            {items.map((res) => (
              <MenuItem value={res}>{res}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectFilter;

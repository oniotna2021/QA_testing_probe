import React from "react";
import { Controller } from "react-hook-form";
import slugify from "slugify";

//UI
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

//COMPONENTS
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";

import { regexOnlyPositiveNumbers } from "utils/misc";

export const CommonComponentSimpleForm = ({
  form,
  control,
  defaultValue = "",
  row = true,
  errors,
}) => {
  return (
    <React.Fragment>
      {row ? (
        <div className="row gx-1">
          {form.map((item, idx) => (
            <div
              className={`mb-3 ${item.className ? item.className : item.class}`}
              key={`${slugify(item.name, { lower: true })}-${idx}`}
            >
              <Controller
                rules={{ required: item?.required, min: item?.min }}
                control={control}
                name={item.name}
                defaultValue={
                  defaultValue &&
                  defaultValue?.[item.name] &&
                  defaultValue?.[item.name] !== null
                    ? defaultValue?.[item.name]
                    : null
                }
                render={({ field }) =>
                  item.type === "select" ? (
                    <FormControl
                      variant="outlined"
                      required={item?.required}
                      error={errors?.[item?.name]}
                    >
                      <InputLabel>{item.label}</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        label={item.label}
                        style={{ marginTop: item.mT || 0 }}
                        required={item?.required}
                        id={slugify(item.name, { lower: true })}
                      >
                        {item.dataSelect.map((itemSelect) => (
                          <MenuItem value={itemSelect.id}>
                            {itemSelect.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : item.multiple === true ? (
                    <ControlledAutocomplete
                      control={control}
                      name={item.name}
                      options={item.dataSelect}
                      required={item?.required}
                      style={{ marginTop: item.mT || 0 }}
                      getOptionLabel={(option) => `${option.name}`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={item.label + (item?.required ? "*" : "")}
                          variant="outlined"
                          margin="normal"
                          error={errors?.[item?.name]}
                        />
                      )}
                      defaultValue={defaultValue[item.name] || []}
                    />
                  ) : (
                    <TextField
                      {...field}
                      fullWidth
                      InputLabelProps={
                        item.type === "time" ? { shrink: true } : null
                      }
                      id={slugify(item.name, { lower: true })}
                      type={item.type ? item.type : "text"}
                      onKeyUp={(e) => {
                        if (item.type === "number") {
                          if (regexOnlyPositiveNumbers.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }
                      }}
                      disabled={item?.disabled}
                      error={errors?.[item?.name]}
                      label={item.label}
                      helperText={item?.help}
                      rows={item?.rows}
                      multiline={item.rows ? true : false}
                      variant="outlined"
                    />
                  )
                }
              />
            </div>
          ))}
        </div>
      ) : (
        form.map((item, idx) => (
          <div
            className={`mb-3 ${item.className ? item.className : item.class}`}
            key={`${slugify(item.name, { lower: true })}-${idx}`}
          >
            <Controller
              rules={{ required: item?.required, min: item?.min }}
              control={control}
              name={item.name}
              defaultValue={
                defaultValue === null
                  ? ""
                  : defaultValue[item.name]
                  ? defaultValue[item.name]
                  : item?.value
                  ? item?.value
                  : defaultValue
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={errors?.[item?.name]}
                  InputLabelProps={
                    item.type === "time" ? { shrink: true } : null
                  }
                  onKeyUp={(e) => {
                    if (item.type === "number") {
                      if (regexOnlyPositiveNumbers.test(e.target.value)) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }
                  }}
                  id={slugify(item.name, { lower: true })}
                  type={item.type ? item.type : "text"}
                  disabled={item?.disabled}
                  label={item.label}
                  helperText={item?.help}
                  rows={item?.rows}
                  multiline={item.rows ? true : false}
                  variant="outlined"
                />
              )}
            />
          </div>
        ))
      )}
    </React.Fragment>
  );
};

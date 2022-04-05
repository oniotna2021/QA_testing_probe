import React, { useState } from "react";
import { Controller } from "react-hook-form";
import slugify from "slugify";
import { useTranslation } from "react-i18next";

//UI
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

//UTILS
import { regexOnlyPositiveNumbers } from "utils/misc";

const autoCompleteFieldsId = [
  7, 6, 8, 9, 10, 28, 29, 30, 31, 32, 33, 35, 59, 70, 72, 103, 104, 107, 109,
  116, 117, 118, 254,
];

const LoadForms = ({ fields, control, errors }) => {
  const { t } = useTranslation();
  const [selectedButton, setSelectedButton] = useState("");

  console.log(fields);

  return (
    <div className="row gx-2">
      {fields &&
        fields.length !== 0 &&
        fields?.map((item, idx) => (
          <React.Fragment
            key={`${slugify(item?.slug, { lower: true })}-${idx}`}
          >
            {item?.is_active === 1 && (
              <div className={`mb-3 ${item.class}`}>
                <Controller
                  key={`${slugify(item?.slug, { lower: true })}-${idx}`}
                  rules={{ required: item?.is_required === 1 }}
                  control={control}
                  name={item?.slug}
                  defaultValue={item.value ? item.value : ""}
                  render={({ field }) =>
                    autoCompleteFieldsId.some(
                      (arrayField) => Number(arrayField) === Number(item.id)
                    ) ? (
                      <Autocomplete
                        onChange={(_, data) => {
                          if (data) {
                            field.onChange(data.id);
                          }
                        }}
                        defaultValue={
                          item?.customDataSelect.filter(
                            (itemField) => itemField.id === item.value
                          )[0]
                        }
                        options={item?.customDataSelect || []}
                        noOptionsText={t("ListPermissions.NoData")}
                        getOptionLabel={(option) => "" + option?.name}
                        renderOption={(option) => (
                          <React.Fragment>
                            <Typography variant="body2">
                              {option?.name}
                            </Typography>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={item.label}
                            error={errors?.[item?.slug]}
                            variant="outlined"
                          />
                        )}
                      />
                    ) : item &&
                      item.input_field_type_id &&
                      item?.input_field_type_id === 3 ? (
                      <FormControl
                        variant="outlined"
                        error={errors?.[item?.slug]}
                      >
                        <InputLabel id={item !== null ? item?.slug : ""}>
                          {item !== null ? item.label : ""}
                        </InputLabel>
                        <Select
                          {...field}
                          labelId={item !== null ? item?.slug : ""}
                          label={item !== null ? item?.label : ""}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          fullWidth
                        >
                          {item?.customDataSelect !== null &&
                            item.customDataSelect.map((itemSelect) => (
                              <MenuItem value={itemSelect.id}>
                                {itemSelect.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    ) : item?.input_field_type_id === 8 ? (
                      <React.Fragment>
                        <Typography variant="body1" className="mb-1">
                          {item?.label}
                        </Typography>
                        <ButtonGroup
                          className="mb-3"
                          fullWidth
                          color="primary"
                          aria-label="contained primary button group"
                        >
                          {item?.dataSelectDefault.map((option, idx) => (
                            <Button
                              onClick={() => setSelectedButton(idx)}
                              variant={
                                selectedButton === idx
                                  ? "contained"
                                  : "outlined"
                              }
                            >
                              {option.name}
                            </Button>
                          ))}
                        </ButtonGroup>
                      </React.Fragment>
                    ) : item?.input_field_type_id === 7 ? (
                      <React.Fragment>
                        <FormControl component="fieldset">
                          <RadioGroup {...field} row>
                            <div className="col d-flex align-items-center">
                              <Typography>{item.label}</Typography>
                              <div className=" col d-flex justify-content-end">
                                <FormControlLabel
                                  value={true}
                                  control={<Radio color="primary" />}
                                  label="Si"
                                />
                                <FormControlLabel
                                  value={false}
                                  control={<Radio color="primary" />}
                                  label="No"
                                />
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <div>
                          {item.value &&
                            item.custom_input_fields &&
                            item.custom_input_fields.map((subField) => (
                              <Controller
                                rules={{
                                  required:
                                    subField.is_required === 1 ? true : false,
                                }}
                                control={control}
                                name={subField.slug}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    className="mb-1"
                                    fullWidth
                                    error={errors.subField?.slug}
                                    id={slugify(subField.slug, { lower: true })}
                                    type={
                                      subField.input_field_type_id === 1
                                        ? "text"
                                        : subField.input_field_type_id === 2
                                        ? "number"
                                        : subField.input_field_type_id === 4
                                        ? "date"
                                        : subField.input_field_type_id === 5
                                        ? "time"
                                        : "text"
                                    }
                                    label={subField.label}
                                    variant="outlined"
                                    multiline={
                                      subField.input_field_type_id === 6
                                        ? true
                                        : false
                                    }
                                    rows={
                                      subField.input_field_type_id === 6 ? 4 : 1
                                    }
                                  />
                                )}
                              />
                            ))}
                        </div>
                      </React.Fragment>
                    ) : (
                      <TextField
                        {...field}
                        label={item.label}
                        fullWidth
                        error={errors?.[item?.slug]}
                        id={slugify(item.slug, { lower: true })}
                        inputProps={{ max: 3, min: 0 }}
                        onKeyUp={(e) => {
                          if (item.input_field_type_id === 2) {
                            if (regexOnlyPositiveNumbers.test(e.target.value)) {
                              field.onChange(e.target.value);
                            } else {
                              e.target.value = "";
                              field.onChange("");
                            }
                          }
                        }}
                        type={
                          item.input_field_type_id === 1
                            ? "text"
                            : item.input_field_type_id === 2
                            ? "number"
                            : item.input_field_type_id === 4
                            ? "date"
                            : item.input_field_type_id === 5
                            ? "time"
                            : "text"
                        }
                        InputLabelProps={
                          item.input_field_type_id === 5
                            ? { shrink: true }
                            : null
                        }
                        variant="outlined"
                        multiline={
                          item.input_field_type_id === 6 ? true : false
                        }
                        rows={item.input_field_type_id === 6 ? 4 : 1}
                      />
                    )
                  }
                />
              </div>
            )}
          </React.Fragment>
        ))}
    </div>
  );
};

export default React.memo(LoadForms);

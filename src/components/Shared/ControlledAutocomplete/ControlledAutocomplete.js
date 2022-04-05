import { Controller } from "react-hook-form";

//UI
import Autocomplete from "@material-ui/lab/Autocomplete";

const ControlledAutocomplete = ({
  options = [],
  multiple = true,
  renderInput,
  style,
  filterOptions,
  getOptionLabel,
  control,
  error,
  handleChange,
  required = false,
  defaultValue,
  name,
  renderOption,
  disabled,
  isFilterOptions,
}) => {
  return (
    <Controller
      error={error}
      render={({ field: { onChange } }) => (
        <Autocomplete
          disabled={disabled}
          multiple={multiple}
          includeInputInList={false}
          style={style}
          //filterOptions={(opt, state) => opt}
          options={options}
          defaultValue={defaultValue || []}
          getOptionSelected={(option, value) => value?.id === option?.id}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          onChange={(_, data) => {
            onChange(data);
            if (handleChange) {
              handleChange(data);
            }
          }}
        />
      )}
      rules={{ required: required }}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
};

export default ControlledAutocomplete;

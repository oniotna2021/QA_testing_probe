//UI
import Autocomplete from "@material-ui/lab/Autocomplete";

const ControlledAutocomplete = ({
  options = [],
  multiple = true,
  renderInput,
  style,
  lockCapacity = 0,
  setChangeSchedule = () => null,
  getOptionLabel,
  handleChange,
  getOptionSelected,
  value,
  name,
  renderOption,
}) => {
  return (
    <Autocomplete
      name={name}
      multiple={multiple}
      includeInputInList={false}
      style={style}
      options={options}
      value={value}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      renderInput={renderInput}
      onChange={(_, data) => {
        handleChange(data);
        if (lockCapacity === 1) {
          setChangeSchedule(false);
        }
      }}
    />
  );
};

export default ControlledAutocomplete;

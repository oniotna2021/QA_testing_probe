//UI
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from '@material-ui/core/Chip';
import { Controller } from "react-hook-form";
import { IconClose } from "assets/icons/customize/config";
import TextField from '@material-ui/core/TextField';

const ControlledAutocompleteChip = ({
  options = [],
  style,
  control,
  isHomolog = false,
  required = false,
  defaultValue,
  name,
  className,
  setTags,
}) => {

  return (
    <Controller
      render={({ field: { onChange } }) => (
        <Autocomplete
          id="tags-outlined"
          multiple
          className={className}
          options={options.map((option) => option.name)}
          defaultValue={defaultValue ? defaultValue : []}
          renderTags={(value, getTagProps) => {
            return (
              value.map((option, index) =>
                <Chip variant='outlined' label={!option ? 'option' : option}
                  {...getTagProps({ index })}
                 
                />
              )
            )

          }


          }
          renderInput={(params) => (
            <TextField {...params} label={name === 'activities_name' ? 'Actividades' : isHomolog ? 'Homólogos' : 'Tags'} variant='outlined' margin='normal' />
          )}
          style={style}
          onChange={(_, data) => {
            // onChange(data)
            onChange(setTags(data))
          }
          }
        />
      )}
      rules={{ required: required }}
      name={name}
      defaultValue={defaultValue ? defaultValue : []}
      control={control}
    />
  );
};

export default ControlledAutocompleteChip;

import React from 'react';
import slugify from 'slugify';
import { Controller } from 'react-hook-form';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };

export const CommonComponentMultiSelect = ({ form, dataSelect, control, defaultValue = ''}) => {
    
    const [selectValue, setselectValue] = React.useState([]);

    const handleChange = (event) => {
        setselectValue(event.target.value)
    };

    return (
        <React.Fragment>
            <div className="row gx-2">
                {form.map((item, idx) =>
                    <div className={`mb-3 ${item.className}`} key={`${slugify(item.name, { lower: true })}-${idx}`}>
                        <Controller
                            rules={{ required: item?.required }}
                            control={control}
                            name={item.name}
                            defaultValue={defaultValue[item.name] ? defaultValue[item.name] : ''}
                            render={({
                                field
                            }) =>(
                                <FormControl variant="outlined">
                                <InputLabel id={slugify(item.name, { lower: true })}>{item.label}</InputLabel>
                                <Select
                                  {...field}
                                  multiple
                                  value={selectValue}
                                  onChange={(e) => {field.onChange(e.target.value); handleChange(e)}}
                                  input={<Input id={slugify(item.name, { lower: true })} />}
                                  renderValue={(selected) => (
                                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                      {selected.map((temp) => (
                                            dataSelect.map((res) => (
                                                temp === res.id && <Chip key={temp} label={temp == res.id && res.name} className="m-1" />
                                            ))
                                      ))}
                                    </div>
                                  )}
                                  MenuProps={MenuProps}
                                >
                                    {dataSelect.map((res) => (
                                        <MenuItem key={res.name} value={res.id}>
                                        {res.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            )}
                        />
                    </div>
                )}
            </div>

        </React.Fragment>
    )
}
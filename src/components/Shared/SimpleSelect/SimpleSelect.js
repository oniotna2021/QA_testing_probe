
import React from 'react';
import slugify from 'slugify';
import { Controller } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export const CommonComponentSimpleSelect = ({form, option, control, value, errors}) => {

    return (
        <React.Fragment>
            {form.map((item, idx) =>
                <div className={`mb-3 ${item.className}`} key={`${slugify(item.name, { lower: true })}-${idx}`}>
                    <Controller
                        rules={{ required: item?.required }}
                        control={control}
                        name={item.name}
                        defaultValue={value? value : ''}
                        render={({
                            field
                        }) =>(
                            <FormControl variant="outlined" error={errors?.[item?.name]}>
                                <InputLabel
                                    id={item.name}
                                >{item.label}</InputLabel>
                                <Select
                                    defaultValue={value? value : ''}
                                    labelId={item.name}
                                    label={item.label}
                                    {...field}
                                    onChange={(e) => {field.onChange(e.target.value);}}
                                    fullWidth
                                    id={slugify(item.name, { lower: true })}
                                >
                                {option.map((res) => (
                                    <MenuItem key={res.name} value={res.id}>
                                    {res.name } 
                                    </MenuItem>
                                ))}
                                </Select>
                        </FormControl>
                        )}
                    />
                    </div>
                )}
        </React.Fragment>
    )
}

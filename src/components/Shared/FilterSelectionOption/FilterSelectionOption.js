import React from 'react'


//UI
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'


const FilterSelectionOption = ({ options = [], label = '', value, handleChange, ...restProps }) => {
    return (
        <React.Fragment>
            <FormControl variant="outlined" >
                <InputLabel id="demo-simple-select-filled-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={value}
                    onChange={handleChange}
                    {...restProps}
                >
                    {options.map(x => <MenuItem key={x.id} value={x.id}>{x.name}</MenuItem>)}
                </Select>
            </FormControl>
        </React.Fragment>
    )
}

export default FilterSelectionOption

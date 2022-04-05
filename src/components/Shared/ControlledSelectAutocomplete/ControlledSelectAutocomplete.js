import {useState, useEffect} from 'react';
import { Controller } from 'react-hook-form';

//UI
import Autocomplete from '@material-ui/lab/Autocomplete';


const ControlledSelectAutocomplete = ({
    options = [], disabled=false,
    renderInput, style, handleMedical, getOptionSelected, setValue,
    getOptionLabel, control, required = false, defaultValue, name, renderOption, setHours, setOption }) => {

    const [objectValue, setObjectValue] = useState(null);

    useEffect(() => {
        if(options.length > 0) {
            const findObject = options.find(i => Number(i.id_medical_profesional) === Number(defaultValue));
            
            if(Boolean(findObject)) {
                setObjectValue(options.find(i => Number(i.id_medical_profesional) === Number(defaultValue)));
                setValue('medical_professional_id', Number(defaultValue))
                handleMedical();
                return;
            }
            
            setObjectValue(null)
        } 
    }, [defaultValue, options, setValue, handleMedical])

    return (
        <Controller
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    disabled={disabled}
                    multiple={false}
                    includeInputInList={false}
                    style={style}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    getOptionSelected={getOptionSelected}
                    renderOption={renderOption}
                    renderInput={renderInput}
                    value={objectValue}
                    onChange={(e, data) => {
                        if(data === null) {
                            setObjectValue(null);
                            field.onChange(null);
                            setOption(null);
                            setHours([]);
                            return;
                        }
                        setHours([]); setOption(0); setValue('hour', null);
                        field.onChange(data?.id_medical_profesional); handleMedical(data?.id_medical_profesional); setObjectValue(data); 
                    }}
                />
            )}
            rules={{ required: required }}
            name={name}
            control={control}
        />
    );
}


export default ControlledSelectAutocomplete;
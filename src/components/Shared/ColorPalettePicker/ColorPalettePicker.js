import React, {useState} from 'react';

// UI
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import ModalPicker from './ModalPicker';

// Components
import { ShardComponentModal } from 'components/Shared/Modal/Modal';

// Misc
import { useStyles } from 'utils/useStyles'

const ColorPalettePicker = ({ valueColor, onChangeColor, dataColors }) => {

    const classes = useStyles()
    const [isOpen, setIsOpen] = useState(false);

    const handleClickModal = () => {
        setIsOpen(true)
    }

    const handleChangeColor = (value) => {
        onChangeColor(value)
        setIsOpen(false)
    }

    return (  
        <>
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Elige un color</InputLabel>
                <OutlinedInput 
                    id="outlined-adornment-amount"
                    fullWidt
                    variant="outlined"
                    type='text'
                    autoComplete="off"
                    startAdornment={<InputAdornment position="start">#</InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickModal}
                                className={classes.colorPalettePickerIconButton}
                                style={{ backgroundColor: valueColor ? valueColor : '#ffffff' }}
                            >
                            </IconButton>
                        </InputAdornment>
                    }
                    onClick={handleClickModal}
                    labelWidth={105}
                    value={valueColor && valueColor.substring(1)}
                />
            </FormControl>

            {isOpen && (
                <ShardComponentModal width='xs' title='Seleccionar color' handleClose={() => setIsOpen(false)} body={<ModalPicker dataColors={dataColors} handleChangeColor={handleChangeColor} setIsOpen={setIsOpen} />} isOpen={isOpen}  />
            )}
        </>
    );
}

export default ColorPalettePicker;
import React from 'react';

// UI
import IconButton from '@material-ui/core/IconButton';

// Misc
import { useStyles } from 'utils/useStyles'

const ModalPicker = ({ dataColors, handleChangeColor }) => {

    const classes = useStyles()

    return (  
        <div className="mb-2">
            {dataColors && dataColors.map((color) => (
                <IconButton
                    key={color.value}
                    aria-label="toggle colors"
                    onClick={() => handleChangeColor(color.value)}
                    className={classes.colorPalettePickerIconButtonItem}
                    style={{ backgroundColor: color.value }}
                >
                </IconButton>
            ))}
        </div>
    );
}

export default ModalPicker;
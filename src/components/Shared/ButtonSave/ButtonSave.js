import React from 'react'

//UI
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

//UTILS
import { useStyles } from 'utils/useStyles';

const ButtonSave = ({ disabled = false, typeButton="submit", loader, text, fullWidth = false, ...restProps }) => {
    const classes = useStyles()

    return (
        <Button className={fullWidth ? classes.button2  : classes.button } {...restProps} disabled={loader || disabled} type={typeButton} fullWidth={fullWidth} color="primary" variant="contained">
            {loader ?
                <CircularProgress
                    size={30}
                    color="secondary" /> :
                text
            }</Button>
    )
}

export default ButtonSave

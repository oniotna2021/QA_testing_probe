import React from 'react'

//UI
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

//UTILS
import { useStyles } from 'utils/useStyles';

const MinButtonLoader = ({ disabled = false, loader, text }) => {
    const classes = useStyles()

    return (
        <Button style={{fontSize: '11px'}} className={classes.minButton} disabled={loader || disabled} type='submit' color="primary" variant="contained">
            {loader ?
                <CircularProgress
                    size={30}
                    color="secondary" /> :
                text
            }</Button>
    )
}

export default MinButtonLoader

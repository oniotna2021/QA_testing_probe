import React from 'react';


import { Link } from 'react-router-dom';


//UI
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Typography from '@material-ui/core/Typography';


const NavigateBack = ({ path, label }) => {

    return (
        <Link to={path} key={'back-' + path} style={{ margin: 40, textDecoration: 'none', color: '#000' }}>
            <KeyboardBackspaceIcon />
            <br></br>
            <Typography variant="h6">{label}</Typography>
        </Link>
    )

}

export default NavigateBack
import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import SearchIcon from '@material-ui/icons/Search';

const ButtonConsultDeporwinUser = ({ errorUserNotFound, handleClick, loading, bgColor='#ddc2f2', styles }) => {
    return (  
        <Tooltip title="Buscar en DeporWin">
            <Button disabled={!errorUserNotFound} fullWidth onClick={handleClick} variant="contained" size="medium" style={{fontSize: '15px', backgroundColor: bgColor, color: '#000', ...styles}} startIcon={<SearchIcon color="#000" />}>
                {loading ? <CircularProgress size={25} color="white" /> : 'DW'}
            </Button>
        </Tooltip>
    );
}

export default ButtonConsultDeporwinUser;
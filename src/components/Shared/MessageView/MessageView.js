import React from 'react';


//UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';



export const MessageView = ({ label }) => {

    return (
        <Box
            style={{ minHeight: '50vh' }}
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Typography variant="h6" className="textEmpty">{label}</Typography>
        </Box>
    )
}
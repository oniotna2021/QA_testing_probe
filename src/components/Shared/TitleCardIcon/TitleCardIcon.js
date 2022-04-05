import React from 'react'


//UI
import Box from '@material-ui/core/Box';

const TitleCardIcon = ({ icon, title }) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center">
            {icon}
        </Box>
    )
}

export default TitleCardIcon

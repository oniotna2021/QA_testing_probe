import React from 'react'


//UI
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress'

const Loading = ({ height = 100 }) => {
    return (
        <Box
            style={{ height }}
            display="flex"
            alignItems="center"
            justifyContent="center">
            <CircularProgress />
        </Box>
    )
}

export default Loading

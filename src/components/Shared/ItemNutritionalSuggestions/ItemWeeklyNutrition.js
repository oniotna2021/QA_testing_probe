import React, { useState, useEffect } from 'react';

//ui
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles'
//icons
import { IconFood } from 'assets/icons/customize/config'

//utils
import { useStyles } from 'utils/useStyles'

const ItemWeeklyNutrition = ({ hour, name, description, items }) => {
    const classes = useStyles()
    const theme = useTheme()

    const [nameFind, setNameFind] = useState('')

    useEffect(()=>{
        setNameFind(items.find(item => item.id === name ))
    },[])

    return (
        <div className='mb-3'>
        <Accordion className={classes.accordionShadow}>
            <AccordionSummary>
                <div className='d-flex'>
                    <IconFood color={theme.palette.black.main}/>
                    <Typography style={{ width: 200 }} className='ms-5'>{nameFind?.name}</Typography>
                    <Typography className='ms-5'>{hour}</Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <Typography className='ms-5'>{description}</Typography>
            </AccordionDetails>
        </Accordion>
        </div>
     );
}
 
export default ItemWeeklyNutrition;
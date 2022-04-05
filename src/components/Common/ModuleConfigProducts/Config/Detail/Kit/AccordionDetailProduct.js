import React from 'react';

//UI
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//utils
import { useStyles } from 'utils/useStyles'

const AccordionDetailProduct = ({ detailProduct }) => {

    const classes = useStyles()

    return ( 
        <div className='mb-4'>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='d-flex align-items-center justify-content-around col-12'>
                    <Typography variant='body1' style={{ fontWeight: 'bold' }}>{detailProduct?.name}</Typography>
                    <Typography variant='body2'>{`${detailProduct.frecuency_quantity} ${detailProduct?.frecuency_type}`}</Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails className='d-flex flex-column'>
                <div className={classes.comercialBoxContainer} style={{ width: '100%', marginBottom: 10 }}>
                    <Typography variant='body1' style={{ fontWeight: 'bold' }}>{`Ref. ${detailProduct?.product_details[0]?.reference}`}</Typography>
                </div>
                <div className={classes.boxObservationTwo} style={{ marginBottom: 10 }}>
                    <Typography className={classes.fontObservation}>Descripción</Typography>
                    <p>{detailProduct?.product_details[0]?.short_description}</p>
                </div>
                <div className={classes.boxObservationTwo}>
                    <Typography className={classes.fontObservation}>Notas</Typography>
                    <p>{detailProduct?.product_details[0]?.public_note}</p>
                </div>
            </AccordionDetails>
        </Accordion>
        </div>
     );
}
 
export default AccordionDetailProduct;
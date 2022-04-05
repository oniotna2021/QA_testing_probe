import React from 'react';

//ui
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

//utils
import { useStyles } from 'utils/useStyles'

const ModalDetailProduct = ({ setOpen, product }) => {

    const classes = useStyles()

    return ( 
        <div className='container'>
            <div className='row m-0 d-flex align-items-center'>
                <div className='col-6 pe-2'>
                    <Typography variant='h5'>{product.name}</Typography>
                    <Typography variant='body1'>Servicio virtual</Typography>

                </div>
                <div className='col-5 ps-2'>
                    <div className={classes.comercialBoxContainer}>
                    <Typography variant='body1' style={{ fontWeight: 'bold'}}>{`Ref. ${product?.product_details[0]?.reference}`}</Typography>
                    </div>
                </div>
                <div className='col-1'>
                    <IconButton onClick={()=>setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
            <div className='row m-0 mt-3'>
                <div className={`my-3 ${classes.boxObservationTwo}`}>
                    <div className='row m-0'>
                        <div className='col-4'>
                            <Typography className={classes.fontObservation}>Canal</Typography>
                            {product?.product_channels.map((item, idx) => (
                                <Typography variant='body1' key={`item - ${idx}`}>{item.name}</Typography>
                            ))}
                        </div>
                        <div className='col-4'>
                            <Typography className={classes.fontObservation}>Frecuencia</Typography>
                            <Typography variant='body1'>{`${product.frecuency_quantity} ${product?.frecuency_type}`}</Typography>
                        </div>
                        <div className='col-4'>
                            <Typography className={classes.fontObservation}>Virtual</Typography>
                            <Typography variant='body1'>{product?.is_virtual === 1 ? 'Si' : 'No'}</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.boxObservationTwo}>
                    <Typography className={classes.fontObservation}>Descripción</Typography>
                    <Typography variant='body1'>{product?.product_details[0]?.short_description}</Typography>
                </div>
            </div>
        </div>
     );
}
 
export default ModalDetailProduct;
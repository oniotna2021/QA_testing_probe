import React from 'react'

//Styles
import { useStyles } from "utils/useStyles";

//Logo
import {LogoDefault} from 'assets/icons/logos/config'

const Error = () => {

    const classes = useStyles();

    return (
        <div className='row container-fluid' >
            <div className='col-md-12 d-flex justify-content-between py-3'>
                <LogoDefault/>
            </div>
            <div className={classes.boxContainError}>
                <div className='col-md-12 d-flex align-items-center justify-content-center position-relative'>
                    <h2 className={classes.boxNumber1}>4</h2>
                    <div className={classes.boxImage}>
                        <img className='img-fluid' src={'https://bodytech-co.imgix.net/site-settings/404.png'}
                            alt={'Logo Pesa'}
                        />                   
                    </div>
                    <h2 className={classes.boxNumber2}>4</h2>
                </div>
                <div className='col-md-12 d-flex align-items-center justify-content-center flex-column'>
                    <h2 className={classes.boxText2}>ERROR</h2>
                    <p className={classes.boxTextp}>Lo sentimos, esta página no está disponible</p>
                </div>
                <div className='col-md-12 d-flex justify-content-center'>
                    <button type='button' className={classes.buttonStart} style={{ width: 300 }} >VOLVER ATRAS</button>
                </div>
            </div>
        </div>
    )
}

export default Error

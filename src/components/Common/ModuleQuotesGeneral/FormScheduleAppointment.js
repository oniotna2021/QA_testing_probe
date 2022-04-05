import React, { useState }from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { Controller, useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core';

import ButtonSave from 'components/Shared/ButtonSave/ButtonSave'
import { useTranslation } from 'react-i18next'

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
    button: {
        width: '130px',
        height: '50px',
        background: 'transparent',
        color: '#3C3C3B',
        marginBottom: '20px'
    }
}));

const FormScheduleAppointment = () => {

    const { t } = useTranslation()
    const { handleSubmit, control } = useForm();
    const classes = useStyles();
    const onSubmit = data => console.log(data);
    const [selectedDate, handleDateChange] = useState(new Date());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='row'>
            <div className='container mx-3'>
            <div className='d-flex justify-content-between'>    
                <FormControl style={{ width: 100 }} variant="outlined">
                    <InputLabel id='Type'>{t('FormAppointmentByMedical.InputType')}</InputLabel>
                        <Select labelId='Type' label='Type'>       
                            <MenuItem value='1'>Todos</MenuItem>
                            <MenuItem value='2'>Todos</MenuItem>                            
                        </Select>
                </FormControl>    
                <FormControl style={{ width: 400 }}>
                    <TextField id="Document" label={t('FormScheduleAppointment.labelDocument')} variant="outlined" />
                </FormControl>          
            </div>
            <div className='col mt-3'>
                <FormControl>
                    <TextField id="Names" label={t('FormScheduleAppointment.labelNames')} variant="outlined" />
                </FormControl>
            </div>
            <div className='d-flex justify-content-between mt-3'>
                <FormControl style={{ width: 250 }} variant="outlined">
                    <InputLabel id='Modality'>{t('FormAppointmentByMedical.Modality')}</InputLabel>
                        <Select labelId='Modality' label={t('FormAppointmentByMedical.Modality')}>       
                            <MenuItem value='1'>Todos</MenuItem>
                            <MenuItem value='2'>Todos</MenuItem>                            
                        </Select>
                </FormControl>
                <FormControl style={{ width: 250 }} variant="outlined">
                    <InputLabel id='typeDate'>{t('FormAppointmentByMedical.TypeVenue')}</InputLabel>
                        <Select labelId='typeDate' label={t('FormAppointmentByMedical.TypeVenue')}>       
                            <MenuItem value='1'>Todos</MenuItem>
                            <MenuItem value='2'>Todos</MenuItem>                            
                        </Select>
                </FormControl>
            </div>
            <div className='d-flex justify-content-between mt-3'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        style={{width: 250}}
                        variant="inline"
                        label='Inicio'
                        inputVariant="outlined"
                        placeholder="MM/DD/AAA"
                        value={selectedDate}
                        InputAdornmentProps={{ position: "start" }}
                        onChange={date => handleDateChange(date)}
                        format="yyyy/MM/dd"
                    />
                </MuiPickersUtilsProvider> 
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        style={{width: 250}}
                        variant="inline"
                        label='Finaliza'
                        inputVariant="outlined"
                        placeholder="MM/DD/AAA"
                        value={selectedDate}
                        InputAdornmentProps={{ position: "start" }}
                        onChange={date => handleDateChange(date)}
                        format="yyyy/MM/dd"
                    />
                </MuiPickersUtilsProvider>
            </div>
            <div className='col mt-3'>
                <FormControl variant="outlined">
                    <InputLabel id='doctorsAvailable'>{t('FormScheduleAppointment.labelDoctors')}</InputLabel>
                        <Select labelId='doctorsAvailable' label={t('FormScheduleAppointment.labelDoctors')}>       
                            <MenuItem value='1'>Todos</MenuItem>
                            <MenuItem value='2'>Todos</MenuItem>                            
                        </Select>
                </FormControl>
            </div>
            <div className='col-12 d-flex justify-content-around my-4'>
                <Button className={classes.button}>{t('Btn.Cancel')}</Button>
                <ButtonSave text={t('Btn.schedule')}/>
            </div>
            </div>
        </form>
    );
}
 



export default FormScheduleAppointment;

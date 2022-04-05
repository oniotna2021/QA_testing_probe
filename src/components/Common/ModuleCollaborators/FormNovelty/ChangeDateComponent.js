import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { es } from 'date-fns/locale';

// UI
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Button from '@material-ui/core/Button';

// Components
import TimePicker from 'components/Shared/TimePicker/TimePicker';
import DatePicker from 'components/Shared/DatePicker/DatePicker';

// Utils
import { useStyles } from 'utils/useStyles';

const propsTimePicker = { ampm: true, inputVariant: "outlined", margin:"normal", minutesStep: 5, mask: "__:__ _M", placeholder: '00:00 AM', 'KeyboardButtonProps': { 'aria-label': 'change time'}, emptyLabel: null, showTodayButton: true, todayLabel: "Hora actual", invalidLabel: "Hora inválida", InputAdornmentProps:{ position: "start" } }

const ChangeDateComponent = ({ isEdit=true, setLoad, selectDate, handleChangeDate }) => {

    const dateFormat = "PP";
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const {t} = useTranslation()
    const [viewDate, setViewDate] = useState(false);

    const handleClickSaveDate = () => {
        if((selectDate.start_date && selectDate.end_date && selectDate.start_time && selectDate.end_time) === null) {
            enqueueSnackbar(t('FormNovelty.WarningSaveDate'), {variant: 'info', autoHideDuration: 2500});
            return;
        }
        setViewDate(false)
        setLoad(true);
    }

    const handleClickViewDate = () => {
        setViewDate(!viewDate); 
    }

    return (  
        <>
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex">
                    <div className="me-4">
                        <DateRangeIcon />
                    </div>

                    <Typography className={classes.textBold} variant='body1'>
                        { selectDate.start_date ? format(selectDate?.start_date, dateFormat, { locale: es }) : 'No hay fecha'} / { selectDate.end_date ? format(selectDate?.end_date, dateFormat, { locale: es }) : 'No hay fecha'}
                    </Typography>
                </div>

                {isEdit && (
                    <Typography variant='body1' onClick={handleClickViewDate} style={{cursor: 'pointer'}}>{t('FormNovelty.ChangeDate')}</Typography>
                )}
            </div>

            { viewDate && (
                <>
                    <Typography className='mb-2 mt-4' variant='body1'>{t('FormNovelty.labelBlockTemp')}</Typography>
                    <div className='col-12 mt-4 d-flex align-items-center justify-content-between'>
                        <DatePicker 
                            id="date-picker"
                            value={selectDate.start_date}
                            onChange={date => handleChangeDate(date, 'start_date')} 
                            placeholder="AAAA/MM/DD"
                        />

                        <FormControl variant="outlined">
                            <TimePicker
                                style={{width: 200, marginLeft: 45}}
                                id="time-picker-2"
                                label={t('label.InitialOur')}
                                name="start_time"
                                value={selectDate.start_time}
                                onChange={(value) => handleChangeDate(value, 'start_time', 'time')}
                                {...propsTimePicker}
                            />
                        </FormControl>
                    </div>
                        <Typography className='my-3' variant='body1'>{t('FormNovelty.labelBlockTempEnd')}</Typography>
                        <div className='col-12 d-flex justify-content-between align-items-center'>
                            <DatePicker 
                                id="date-picker"
                                value={selectDate.end_date}
                                onChange={date => handleChangeDate(date, 'end_date')} 
                                name='date_picker'
                                placeholder="AAAA/MM/DD"
                            />

                            <FormControl variant="outlined">
                                <TimePicker
                                    style={{width: 200, marginLeft: 45}}
                                    id="time-picker-2"
                                    label={t('FormVenueTurnsWorking.HourFinal')}
                                    name="end_time"
                                    value={selectDate.end_time}
                                    onChange={(value) => handleChangeDate(value, 'end_time', 'time')}
                                    {...propsTimePicker}
                                />
                            </FormControl>
                    </div>  

                    <Button onClick={handleClickSaveDate} fullWidth className="mt-3">{t('FormNovelty.SaveDate')}</Button>
                </>
            )}
        </>
    );
}

export default ChangeDateComponent;
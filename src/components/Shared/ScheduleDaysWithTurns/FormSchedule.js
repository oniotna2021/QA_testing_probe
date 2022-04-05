import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

//UI
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import ButtonBase from '@material-ui/core/ButtonBase';
import Checkbox from '@material-ui/core/Checkbox';

// Components
import TimePicker from 'components/Shared/TimePicker/TimePicker';

//utils
import { useStyles } from 'utils/useStyles';
import { formatDateToHHMMSS } from 'utils/misc';
import { isDate } from 'date-fns/fp';

import { IconDeleteItem } from 'assets/icons/customize/config';

const propsTimePicker = { ampm: true, inputVariant: "outlined", margin:"normal", minutesStep: 5, mask: "__:__ _M", 'KeyboardButtonProps': { 'aria-label': 'change time'}, emptyLabel: null, showTodayButton: true, todayLabel: "Hora actual", invalidLabel: "Hora inválida", InputAdornmentProps:{ position: "start" } }

const FormSchedule = ({ assingSameHour, selectedDays, currentDayId, schedules, setSchedules, idScheduleDay, indexSchedule }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndtime] = useState(null);
    const [modality, setIsModality] = useState(false);

    useEffect(() => {
        if(idScheduleDay !== null && currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay);

            if(typeof dataFilter === 'object' ? Object.keys(dataFilter).length > 0 : dataFilter.length > 0) {
                const newDateStart = dataFilter[0]?.start_time === null ? null : dataFilter[0]?.start_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].start_time}`)
                const newDateEnd = dataFilter[0]?.end_time === null ? null : dataFilter[0]?.end_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].end_time}`)
                const modalityCondition = (dataFilter[0]?.modality === 'virtual') ? true : false;
                setIsModality(modalityCondition);
                setStartTime(newDateStart)
                setEndtime(newDateEnd)
            }
        }
    }, [currentDayId, assingSameHour, schedules, idScheduleDay])

    const handleChangeSchedule = (value, nameTime) => {
        if(!isDate(value)) return;

        const hourFormat = formatDateToHHMMSS(value);

        if(assingSameHour) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(selectedDays.some((day) => schedule.day_week_id === day && schedule.dayId === idScheduleDay)) {
                    return {
                        ...schedule,    
                        shifts_venue_id: null,
                        [nameTime]: hourFormat
                    }
                }
                return schedule
            }))
        } else {
            setSchedules(schedules => schedules.map((schedule) => {
                if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
                    return { ...schedule, shifts_venue_id: null, [nameTime]: hourFormat }
                }
                return schedule
            }))
        }
    }

    const clearHour = () => {
        if(assingSameHour) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(selectedDays.some((day) => day === schedule.day_week_id && schedule.dayId === idScheduleDay)) {
                    return { ...schedule, start_time: null, end_time: null }
                }
                return schedule
            }))
        } else {
            setSchedules(schedules => schedules.map((schedule) => {
                if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
                    return { ...schedule, start_time: null, end_time: null }
                }
                return schedule
            }))
        }
        setStartTime(null)
        setEndtime(null)
    }

    const deleteSchedule = () => {
        setSchedules(schedules => schedules.filter((item) => !(item.day_week_id === currentDayId && item.dayId === idScheduleDay)))
    }

    const handleChangeModality = (value) => {
        const modalitySchedule = (value === true) ? 'virtual' : 'presencial';
        setSchedules(schedules => schedules.map((schedule) => {
            if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
                return { ...schedule, modality: modalitySchedule }
            }
            return schedule
        }))
    }

    return (  
        <>
            {currentDayId || assingSameHour ? (
                <>
                    <div className="mt-4 d-flex justify-content-between align-items-center">
                        <Typography className={`${classes.boldText}`} variant="body2">Horario {indexSchedule}</Typography>

                        {indexSchedule > 1 && (
                            <IconButton variant="outlined" size="medium" onClick={deleteSchedule}>
                                <IconDeleteItem color="#3C3C3B" width="25" height="25" />
                            </IconButton>
                        )}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <div className="me-2" style={{width: '100%'}}>
                            <FormControl variant="outlined">
                                <TimePicker 
                                    id="time-picker-1"
                                    label={t('FormVenueTurnsWorking.HourInit')}
                                    name="start_time"
                                    value={startTime}
                                    onChange={(e) => handleChangeSchedule(e, 'start_time')}
                                    {...propsTimePicker}
                                />
                            </FormControl>
                        </div>

                        <div style={{width: '100%'}}>
                            <FormControl variant="outlined">
                                <TimePicker
                                    id="time-picker-2"
                                    label={t('FormVenueTurnsWorking.HourFinal')}
                                    name="end_time"
                                    value={endTime}
                                    onChange={(e) => handleChangeSchedule(e, 'end_time')}
                                    {...propsTimePicker}
                                />
                            </FormControl>
                        </div>
                    </div>

                    <div className="row align-items-center justify-content-center">
                        <div className="col-3">
                            <FormControl>
                                <Checkbox
                                    name="modality"
                                    onChange={(e) => {handleChangeModality(e.target.checked)}}
                                    checked={modality}
                                    color="primary"
                                />
                            </FormControl>
                        </div>
                        <div className="col-9 justify-items-center">
                            <Typography variant="body2">¿Aplica para modalidad virtual?</Typography>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <ButtonBase onClick={clearHour} className={`${classes.buttonClearHour}`}>
                            Limpiar hora
                        </ButtonBase>
                    </div>
                </>
            ) : ''}
        </>
    );
}

export default FormSchedule;
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { isDate } from 'date-fns';

//UI
import { ButtonBase } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

// Components
import TimePicker from 'components/Shared/TimePicker/TimePicker';

//utils
import { useStyles } from 'utils/useStyles';
import { formatDateToHHMMSS, formatToHHMMSS, sumTimes} from 'utils/misc';

const propsTimePicker = { ampm: true, inputVariant: "outlined", margin:"normal", minutesStep: 5, mask: "__:__ _M", 'KeyboardButtonProps': { 'aria-label': 'change time'}, emptyLabel: null, showTodayButton: true, todayLabel: "Hora actual", invalidLabel: "Hora inválida", InputAdornmentProps:{ position: "start" } }

const FormSchedule = ({ duration=null, assingSameHour, selectedDays, currentDayId, schedules, setSchedules }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndtime] = useState(null);

    useEffect(() => {
        if(currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId);
            const newDateStart = dataFilter[0]?.start_time === null ? null : dataFilter[0]?.start_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].start_time}`)
            const newDateEnd = dataFilter[0]?.end_time === null ? null : dataFilter[0]?.end_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].end_time}`)
            setStartTime(newDateStart)
            setEndtime(newDateEnd)
        }
    }, [currentDayId, schedules])

    const handleChange = (value, nameTime) => {
        if(!isDate(value)) return;

        const hourFormat = formatDateToHHMMSS(value);

        if(assingSameHour) {
            if(duration !== null && isDate(duration)) {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(selectedDays.some((day) => day === schedule.day_week_id)) {
                        return {
                            ...schedule,
                            [nameTime]: hourFormat,
                            end_time: sumTimes(formatDateToHHMMSS(duration), formatToHHMMSS(hourFormat))
                        }
                    }
                    return schedule
                }))
            } else {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(selectedDays.some((day) => day === schedule.day_week_id)) {
                        return { ...schedule, [nameTime]: hourFormat }
                    }
                    return schedule
                }))
            }
        } else {
            if(duration !== null && isDate(duration)) {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(schedule.day_week_id === currentDayId) {
                        return { ...schedule, [nameTime]: hourFormat, end_time: sumTimes(formatDateToHHMMSS(duration), formatToHHMMSS(hourFormat)) }
                    }
                    return schedule
                }))
            } else {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(schedule.day_week_id === currentDayId) {
                        return { ...schedule, [nameTime]: hourFormat }
                    }
                    return schedule
                }))
            }
        }
    }

    const clearHour = () => {
        if(assingSameHour) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(selectedDays.some((day) => day === schedule.day_week_id)) {
                    return { ...schedule, start_time: null, end_time: null }
                }
                return schedule
            }))
        } else {
            setSchedules(schedules => schedules.map((schedule) => {
                if(schedule.day_week_id === currentDayId) {
                    return { ...schedule, start_time: null, end_time: null }
                }
                return schedule
            }))
        }
        setStartTime(null)
        setEndtime(null)
    }

    return (  
        <>
            {currentDayId || assingSameHour ? (
                <>
                    <div className="d-flex justify-content-between mt-4">
                        <div className="me-2" style={{width: '100%'}}>
                            <FormControl variant="outlined">
                                <TimePicker 
                                    id="time-picker-1"
                                    label={t('FormVenueTurnsWorking.HourInit')}
                                    name="start_time"
                                    value={startTime}
                                    onChange={(e) => handleChange(e, 'start_time')}
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
                                    onChange={(e) => handleChange(e, 'end_time')}
                                    disabled={duration !== null ? true : false}
                                    {...propsTimePicker}
                                />
                            </FormControl>
                        </div>
                    </div>

                    <div className=" d-flex justify-content-end">
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
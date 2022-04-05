import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { isDate, addMinutes } from 'date-fns';

//UI
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { IconDeleteItem } from 'assets/icons/customize/config';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// Components
import TimePicker from 'components/Shared/TimePicker/TimePicker';
import ControlledAutocomplete from 'components/Shared/AutocompleteSelect/AutocompleteSelect';

//utils
import { useStyles } from 'utils/useStyles';
import { convertH2M, formatDateToHHMMSS } from 'utils/misc';

const propsTimePicker = { ampm: true, inputVariant: "outlined", margin:"normal", minutesStep: 5, mask: "__:__ _M", 'KeyboardButtonProps': { 'aria-label': 'change time'}, emptyLabel: null, showTodayButton: true, todayLabel: "Hora actual", invalidLabel: "Hora inválida", InputAdornmentProps:{ position: "start" } }

const FormSchedule = ({ duration=null, currentDayId, indexSchedule, assingSameHour, managers, setManagers, selectedDays, idScheduleDay, schedules, setSchedules }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [managersSelect, setManagersSelect] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndtime] = useState(null);

    const setDefaultManagers = useCallback((array) => {
        if(array.length === 0) return [];

        let findArr = [];

        array.forEach((arr) => {
            const managerFind =  managers.find((manager) => manager.id === arr);
            
            if(Boolean(managerFind)) {
                findArr.push(managerFind)
            }
        })

        return findArr ? findArr : [];
    }, [managers])

    useEffect(() => {
        if(idScheduleDay !== null && currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay);
            if(typeof dataFilter === 'object' ? Object.keys(dataFilter).length > 0 : dataFilter.length > 0) {
                const newDateStart = dataFilter[0]?.start_time === null ? null : dataFilter[0]?.start_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].start_time}`)
                const newDateEnd = dataFilter[0]?.end_time === null ? null : dataFilter[0]?.end_time.length === 0 ? null : new Date(`2021-08-18T${dataFilter[0].end_time}`)
                setManagersSelect(setDefaultManagers(dataFilter[0].managers ? dataFilter[0].managers : []))
                setStartTime(newDateStart)
                setEndtime(newDateEnd)
            }
        }
    }, [idScheduleDay, currentDayId, schedules, setDefaultManagers])

    const handleChange = (value, nameTime) => {
        if(!isDate(value)) return;

        const hourFormat = formatDateToHHMMSS(value);

        if(assingSameHour) {
            if(duration !== null && isDate(duration)) {
                const endTimeWithMinutes = addMinutes(value, convertH2M(formatDateToHHMMSS(duration)));

                setSchedules(schedules => schedules.map((schedule) => {
                    if(selectedDays.some((day) => schedule.day_week_id === day && schedule.dayId === idScheduleDay)) {
                        return {
                            ...schedule,
                            [nameTime]: hourFormat,
                            end_time: formatDateToHHMMSS(endTimeWithMinutes)
                        }
                    }
                    return schedule
                }))
            } else {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(selectedDays.some((day) => schedule.day_week_id === day && schedule.dayId === idScheduleDay)) {
                        return { ...schedule, [nameTime]: hourFormat }
                    }
                    return schedule
                }))
            }
        } else {
            if(duration !== null && isDate(duration)) {
                const endTimeWithMinutes = addMinutes(value, convertH2M(formatDateToHHMMSS(duration)));

                setSchedules(schedules => schedules.map((schedule) => {
                    if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
                        return { ...schedule, [nameTime]: hourFormat, end_time: formatDateToHHMMSS(endTimeWithMinutes) }
                    }
                    return schedule
                }))
            } else {
                setSchedules(schedules => schedules.map((schedule) => {
                    if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
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

    const handleChangeManagers = (data) => {
        setManagersSelect(data)
        if(assingSameHour) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(selectedDays.some((day) => schedule.day_week_id === day && schedule.dayId === idScheduleDay)) {
                    return { ...schedule, managers: data ? data.map((item) => item.id) : [] }
                }
                return schedule
            }))
        } else {
            setSchedules(schedules => schedules.map((schedule) => {
                if(schedule.day_week_id === currentDayId && schedule.dayId === idScheduleDay) {
                    return { ...schedule, managers: data ? data.map((item) => item.id) : [] }
                }
                return schedule
            }))
        }
    }

    return (  
        <>
            {idScheduleDay || assingSameHour ? (
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

                    <div className="mt-2">
                        <ControlledAutocomplete
                            multiple={true}
                            value={managersSelect}
                            handleChange={handleChangeManagers}
                            name="managers"
                            options={(managers || [])}
                            getOptionSelected={(option, value) => value?.id === option?.id}
                            getOptionLabel={(option) => `${option?.first_name} ${option?.last_name}`}
                            renderInput={(params) => <TextField {...params}
                                label={t('FormsVenueActivities.SelectResponsable')}
                                variant="outlined"
                                margin="normal" />
                            }
                        />
                    </div>
                </>
            ) : ''}
        </>
    );
}

export default FormSchedule;
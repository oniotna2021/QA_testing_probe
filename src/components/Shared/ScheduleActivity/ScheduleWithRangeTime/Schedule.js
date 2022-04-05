import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next'
import { isDate, addMinutes } from 'date-fns';

//UI
import { useStyles } from 'utils/useStyles';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

// Components
import Loading from 'components/Shared/Loading/Loading';
import FormSchedule from './FormSchedule';
import ScheduleButton from 'components/Shared/ScheduleButton/ScheduleButton';

//Services
import { getAllDayWeeks } from 'services/Reservations/DayWeek';

// Hooks
import useIsMounted from 'hooks/useIsMounted';

//utils
import { errorToast, mapErrors, formatDateToHHMMSS, convertH2M } from 'utils/misc';

const Schedules = ({ schedulesEmployee, duration, title, daysWeek, defaultValues=[], setSchedules, schedules, isFestive }) => {

    const isMounted = useIsMounted();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation()

    const [dataSuccess, setDataSuccess] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [currentDayId, setCurrentDay] = useState(0);
    const [assingSameHour, setAssingSameHour] = useState(false);

    useEffect(() => {
        const setDaysFetch = () => {
            getAllDayWeeks().then(({ data }) => {
                if (data && data.status === 'success' && data.data && data.data.length > 0) {
                    if(isMounted.current) {
                        let arrDaysWeek = [];
                        data.data.forEach((day) => {
                            const isWorkingEmployee = schedulesEmployee.some((p) => p.day_week_id === day.id)
                            if(daysWeek[day.id] || (day.id === 8 && isFestive)) {
                                if(isWorkingEmployee) {
                                    arrDaysWeek.push({ 
                                        day_week_id: day.id,
                                        start_time: null,
                                        end_time: null,
                                        name: day.name.substring(0, 3), 
                                        managers: [],
                                    })
                                }
                            }
                        })
                        setSchedules(arrDaysWeek);
                        setDataSuccess(true)
                    }
                } else {
                    enqueueSnackbar(mapErrors(data?.data), errorToast);
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
        }
        
        if(schedulesEmployee.length > 0) {
            setDaysFetch();
        }
    }, [enqueueSnackbar, setSchedules, isMounted, daysWeek, schedulesEmployee, isFestive])

    useEffect(() => {
        if(defaultValues.length !== 0 && dataSuccess) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(defaultValues.some((p) => p.day_week_id === schedule.day_week_id)) {
                    const dataToUpdate = defaultValues.find((p) => p.day_week_id === schedule.day_week_id)
                    return {
                        ...schedule,
                        start_time: dataToUpdate.start_time === '' ? null : dataToUpdate.start_time,
                        end_time: dataToUpdate.end_time === '' ? null : dataToUpdate.end_time,
                    }
                }
                return schedule;
            }))
        }
    }, [dataSuccess, defaultValues, setSchedules])

    useEffect(() => {
        if(duration !== null && isDate(duration) && dataSuccess) {
            setSchedules(schedules => schedules.map((day) => {
                const startTimeToAdd = (day.start_time === null) ? null : (isDate(day.start_time) ? day.start_time : new Date(`2021-08-18T${day.start_time}`));
                if(startTimeToAdd !==  null) {
                    const endTimeSum = addMinutes(startTimeToAdd, convertH2M(formatDateToHHMMSS(duration)))
                    
                    return { ...day, end_time: formatDateToHHMMSS(endTimeSum) }
                }
                return day;
            }))
        }
    }, [duration, setSchedules, dataSuccess])

    const handleClickDay = (e) => {
        const idDay = Number(e.target.value)
        
        if(assingSameHour) {
            if(selectedDays.some((val) => val === idDay)) {
                const selectedDaysFilter = selectedDays.filter((day) => day !== idDay)
                setSelectedDays(selectedDaysFilter)
                setCurrentDay(selectedDaysFilter[selectedDaysFilter.length - 1])
            } else {
                setSelectedDays(selectedDays => [...selectedDays, idDay])
                setCurrentDay(idDay)
            }
            return;
        } 

        setSelectedDays([])
        setCurrentDay(idDay)
    }

    const handleChangeCheck = (e) => {
        setAssingSameHour(e.target.checked); 
        setCurrentDay(0); 
        setSelectedDays([])
    }

    return (  
            <>
                {title && <Typography className={classes.textBold}>{title}</Typography>}

                <div className="mt-2 py-2">
                    <div className="col">
                        <div className="d-flex align-items-center justify-content-center">
                            <div>
                                <FormControl>
                                    <Checkbox
                                        name="check_assing_hour"
                                        onChange={handleChangeCheck}
                                        checked={assingSameHour}
                                        color="primary"
                                    />
                                </FormControl>
                            </div>
                            <div>
                                <Typography variant="body2">{t('FormsVenueSchedule.CheckAssingSameHour')}</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="d-flex justify-content-center">
                    { schedules.length === 0 ? <Loading />
                        : schedules && schedules.map((day) => (
                            <ScheduleButton assingSameHour={assingSameHour} currentDayId={currentDayId} dayData={day} selectedDays={selectedDays} handleClick={handleClickDay} key={day.day_week_id} >
                                {day.name}
                            </ScheduleButton>
                        ))
                    }
                </div>

                <div className="mb-4">
                    <FormSchedule duration={duration} selectedDays={selectedDays} assingSameHour={assingSameHour} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} />
                </div>
            </>
    );
}

export default Schedules;
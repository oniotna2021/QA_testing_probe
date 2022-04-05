import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next'


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
import { errorToast, formatDateToHHMMSS, formatToHHMMSS, mapErrors, sumTimes} from 'utils/misc';
import isDate from 'date-fns/isDate';

const ScheduleCommon = ({title, handleChangeCheck, assingSameHour, duration, selectedDays, setSchedules, currentDayId, schedules, handleClickDay}) => {

    const classes = useStyles();
    const { t } = useTranslation()

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                {title && <Typography className={classes.textBold}>{title}</Typography>}

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
        
            <div className="row">
                <div className="col-6 d-flex justify-content-start align-items-center">
                    { schedules.length === 0 ? <Loading />
                        : schedules && schedules.map((day) => (
                            <ScheduleButton assingSameHour={assingSameHour} currentDayId={currentDayId} dayData={day} selectedDays={selectedDays} handleClick={handleClickDay} key={day.day_week_id} >
                                {day.name}
                            </ScheduleButton>
                        ))
                    }
                </div>

                <div className="col-6 mb-4">
                    <FormSchedule duration={duration} selectedDays={selectedDays} assingSameHour={assingSameHour} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} />
                </div>
            </div>
        </div>
    )
}

const Schedules = ({ title, typeSchedule='large', duration=null, defaultValues=[], setSchedules, schedules }) => {

    const isMounted = useIsMounted();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation()

    const [dataSuccess, setDataSuccess] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [currentDayId, setCurrentDay] = useState(0);
    const [assingSameHour, setAssingSameHour] = useState(false);

    useEffect(() => {
        getAllDayWeeks().then(({ data }) => {
            if (data && data.status === 'success' && data.data && data.data.length > 0) {
                if(isMounted.current) {
                    const dataDaysWeek = data.data.map((day) => ({ 
                        day_week_id: day.id,
                        start_time: null,
                        end_time: null,
                        name: day.name.substring(0, 3), 
                        managers: [],
                    }))
                    setSchedules(dataDaysWeek);
                    setDataSuccess(true)
                }
            } else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar, setSchedules, isMounted])

    useEffect(() => {
        if(duration !== null && isDate(duration)) {
            setSchedules(schedules => schedules.map((day) => {
                if(day.start_time !== null && isDate(day.start_time)) {
                    return { ...day, end_time: sumTimes(formatDateToHHMMSS(duration), formatToHHMMSS(day.start_time))}
                }
                return day;
            }))
        }
    }, [duration, setSchedules])

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
            {typeSchedule === 'common' ? <ScheduleCommon title={title} handleChangeCheck={handleChangeCheck} assingSameHour={assingSameHour} duration={duration} selectedDays={selectedDays} setSchedules={setSchedules} currentDayId={currentDayId} schedules={schedules} handleClickDay={handleClickDay} />
            :
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
            }
        </>
    );
}

export default Schedules;
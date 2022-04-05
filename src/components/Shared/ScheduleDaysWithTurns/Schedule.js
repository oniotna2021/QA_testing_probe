import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack';

//UI
import { useStyles } from 'utils/useStyles';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

// Hooks
import useIsMounted from 'hooks/useIsMounted';

// Components
import Loading from 'components/Shared/Loading/Loading';
import ScheduleButton from 'components/Shared/ScheduleButton/ScheduleButton';
import ListHours from './ListHours';

// Services
import { getAllDayWeeks } from 'services/Reservations/DayWeek';

// Utils
import { errorToast, mapErrors } from 'utils/misc';

const Schedules = ({ title, defaultValues=[], setSchedules, schedules }) => {

    const isMounted = useIsMounted();
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();
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
                        shifts_venue_id: null,
                        start_time: null,
                        end_time: null,
                        name: day.name.substring(0, 3), 
                        dayId: 1
                    }))
                    setSchedules(dataDaysWeek);
                    setDataSuccess(true)
                }
            } else {
                enqueueSnackbar(mapErrors(data?.data), errorToast);
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar, setSchedules, isMounted, setDataSuccess])

    useEffect(() => {
        if(defaultValues.length !== 0 && dataSuccess) {
            let schedulesArr = [];
            schedules.forEach((schedule) => {
                if(defaultValues.some((p) => p.day_week_id === schedule.day_week_id)) {
                    const dataToUpdate = defaultValues.filter((p) => p.day_week_id === schedule.day_week_id)
                    const arrToUpdate = dataToUpdate.map((item) => ({
                        ...item,
                        name: schedule.name,
                        dayId: item.id,
                        id: item.id,
                        shifts_venue_id: item?.shifts_venue_id,
                        start_time: item.start_time === '' ? null : item.start_time,
                        end_time: item.end_time === '' ? null : item.end_time,
                        modality: item?.modality
                    }))
                    schedulesArr = [...schedulesArr, ...arrToUpdate]
                    return;
                }
                schedulesArr = [...schedulesArr, schedule]
            })
            setSchedules(schedulesArr)
        }
    }, [dataSuccess, defaultValues, setSchedules])

    const scheduleButtonsData = useMemo(() => {
        if(schedules.length > 0) {
            var hash = {};
            return schedules.filter((current) => {
                var exists = !hash[current.day_week_id];
                hash[current.day_week_id] = true;
                return exists;
            });
        }
    }, [schedules])

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
                        <div className="d-flex justify-content-center">
                            <Typography variant="body2">{t('FormsVenueSchedule.CheckAssingSameHour')}</Typography>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="d-flex justify-content-center">
                { schedules.length === 0 ? <Loading />
                    : scheduleButtonsData && scheduleButtonsData.map((day) => (
                        <ScheduleButton assingSameHour={assingSameHour} currentDayId={currentDayId} dayData={day} selectedDays={selectedDays} handleClick={handleClickDay} key={day.day_week_id} >
                            {day.name}
                        </ScheduleButton>
                    ))
                }
            </div>

            <div className="mb-4">
                <ListHours selectedDays={selectedDays} assingSameHour={assingSameHour} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} />
            </div>
        </>
    );
}

export default Schedules;
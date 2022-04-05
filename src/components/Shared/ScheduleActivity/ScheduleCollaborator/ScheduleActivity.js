import React, { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';

// Components
import Loading from 'components/Shared/Loading/Loading';
import ListHours from './ListHours';
import ScheduleButton from 'components/Shared/ScheduleButton/ScheduleButton';

//Services
import { getAllDayWeeks } from 'services/Reservations/DayWeek';

// Hooks
import useIsMounted from 'hooks/useIsMounted';

//utils
import { errorToast, mapErrors } from 'utils/misc';

const ScheduleActivity = ({ userId, defaultValues=[], setSchedules, schedules }) => {

    const isMounted = useIsMounted();
    const { enqueueSnackbar } = useSnackbar();

    const [managers, setManagers] = useState([]);
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
                        id: 1
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
        if(defaultValues.length !== 0 && dataSuccess) { 
            let schedulesArr = [];
            schedules.forEach((schedule) => {
                if(defaultValues.some((p) => p.day_week_id === schedule.day_week_id)) {
                    const dataToUpdate = defaultValues.filter((p) => p.day_week_id === schedule.day_week_id)
                    const arrToUpdate = dataToUpdate.map((item) => ({
                        ...item,
                        name: schedule.name,
                        id: item.id,
                        start_time: item.start_time === '' ? null : item.start_time,
                        end_time: item.end_time === '' ? null : item.end_time,
                        optionals_trainers: item.optionals_trainers,
                        managers: []
                    }))
                    schedulesArr = [...schedulesArr, ...arrToUpdate]
                    return;
                }
                schedulesArr = [...schedulesArr, schedule]
            })
            setSchedules(schedulesArr)
        }
    }, [defaultValues, setSchedules, dataSuccess])

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
        setCurrentDay(idDay)
    }

    return (  
        <>
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
                <ListHours managers={managers} setManagers={setManagers} selectedDays={selectedDays} assingSameHour={assingSameHour} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} />
            </div>
        </>
    );
}

export default ScheduleActivity;
import React, { useState, useEffect } from 'react'

// Components
import FormSchedule from './FormSchedule';

const ListHours = ({ assingSameHour, selectedDays, managers, setManagers, currentDayId, schedules, setSchedules }) => {

    const [schedulesDayData, setSchedulesDayData] = useState([]);

    useEffect(() => {
        if(currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId);
            setSchedulesDayData(dataFilter);
        }
    }, [currentDayId, schedules])

    return (  
        <>
            { schedulesDayData.length > 0 ? (
                <>
                    { schedulesDayData && schedulesDayData.map((item, index) => (
                        <>
                            <FormSchedule key={index} idScheduleDay={item?.id ? item.id : index} availableManagers={item?.optionals_trainers} indexSchedule={index+1} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} selectedDays={selectedDays} assingSameHour={assingSameHour} />
                        </>
                    ))}
                </>
            ) : null}
        </>
    );
}

export default ListHours;
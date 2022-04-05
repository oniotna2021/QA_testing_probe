import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

//UI
import { Button, Typography } from '@material-ui/core';
import {IconClock} from 'assets/icons/customize/config';

// Components
import FormSchedule from './FormSchedule';

//utils
import { useStyles } from 'utils/useStyles';

const ListHours = ({ duration=null, assingSameHour, selectedDays, managers, setManagers, currentDayId, schedules, setSchedules }) => {

    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation()
    const [schedulesDayData, setSchedulesDayData] = useState([]);

    useEffect(() => {
        if(currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId);
            setSchedulesDayData(dataFilter);
        }
    }, [currentDayId, schedules])

    const handleClickCreateRangeSchedule = () => {
        const newScheduleDayAdd = schedulesDayData[0];
        let min = 1718;
        let max = 3429;
        let x = Math.floor(Math.random()*(max-min+1)+min);

        if(assingSameHour) {
            const arrAssingSameHour = selectedDays.map((day) => {
                return {day_week_id: day, start_time: null, end_time: null, dayId: x, managers: []}
            });
            
            setSchedules(schedules => [...schedules, ...arrAssingSameHour]);
        } else {
            setSchedules(schedules => [...schedules, {day_week_id: newScheduleDayAdd.day_week_id, start_time: null, end_time: null, dayId: x, managers: []}]);
        }
    }

    return (  
        <>
            { schedulesDayData.length > 0 ? (
                <>
                    { schedulesDayData && schedulesDayData.map((item, index) => (
                        <FormSchedule key={index} idScheduleDay={item?.dayId ? item.dayId : index} indexSchedule={index+1} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} selectedDays={selectedDays} assingSameHour={assingSameHour} duration={duration} managers={managers} setManagers={setManagers} />
                    ))}
                </>
            ) : null }

            {currentDayId ? (
                <div className="row mt-4">
                    <div className="col-7 d-flex align-items-center justify-content-center">
                        <Typography variant="body2">{t('FormsVenueActivities.CreateScheduleDescription')}</Typography>
                    </div>

                    <div className="col-5 d-flex align-items-center justify-content-end">
                        <Button onClick={handleClickCreateRangeSchedule} className={classes.buttonCreateRangeSchedule} startIcon={<IconClock color={theme.palette.primary.main} />}>{t('FormsVenueActivities.CreateSchedule')}</Button>
                    </div>
                </div>
            ) : ''}
        </>
    );
}

export default ListHours;
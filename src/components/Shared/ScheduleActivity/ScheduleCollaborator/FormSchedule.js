import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next';

//UI
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

// Components
import ControlledAutocomplete from 'components/Shared/AutocompleteSelect/AutocompleteSelect';

//utils
import { useStyles } from 'utils/useStyles';
import { formatToHHMM } from 'utils/misc';

const FormSchedule = ({ currentDayId, indexSchedule, availableManagers, selectedDays, idScheduleDay, schedules, setSchedules }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const [managersSelect, setManagersSelect] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndtime] = useState('');

    const setDefaultManagers = useCallback((array) => {
        if(array.length === 0) return null;

        return availableManagers.find((manager) => manager.id === array[0])

    }, [availableManagers])

    useEffect(() => {
        if(idScheduleDay !== null && currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId && schedule.id === idScheduleDay);
            if(typeof dataFilter === 'object' ? Object.keys(dataFilter).length > 0 : dataFilter.length > 0) {
                const newDateStart = dataFilter[0]?.start_time === null ? '' : dataFilter[0]?.start_time;
                const newDateEnd = dataFilter[0]?.end_time === null ? '' : dataFilter[0]?.end_time;
                setManagersSelect(setDefaultManagers(dataFilter[0].managers ? dataFilter[0].managers : []))
                setStartTime(newDateStart)
                setEndtime(newDateEnd)
            }
        }
    }, [idScheduleDay, currentDayId, schedules, setDefaultManagers])

    const handleChangeManagers = (data) => {
        setManagersSelect(data)
        console.log(data)
        setSchedules(schedules => schedules.map((schedule) => {
            if(schedule.day_week_id === currentDayId && schedule.id === idScheduleDay) {
                return { ...schedule, managers: [data?.id] || [] }
            }
            return schedule
        }))
    }

    return (  
        <>
            {idScheduleDay ? (
                <>
                    <div className="mt-4 d-flex align-items-center">
                        <Typography className={`${classes.boldText} me-3`} variant="body2">Horario {indexSchedule}</Typography>
                        { startTime.length > 0 && endTime.length > 0 && (
                            <Typography variant="body2">{formatToHHMM(startTime)} / {formatToHHMM(endTime)} </Typography>
                        )}
                    </div>

                    <div className="mt-2">
                        <ControlledAutocomplete
                            multiple={false}
                            value={managersSelect}
                            handleChange={handleChangeManagers}
                            name="managers"
                            options={(availableManagers || [])}
                            getOptionLabel={(option) => option.name}
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
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

//UI
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'

//utils
import { formatToHHMM } from 'utils/misc';

const FormScheduleWithTurns = ({ dataTurns, assingSameHour, selectedDays, currentDayId, schedules, setSchedules }) => {

    const { t } = useTranslation();
    const [idShift, setIdShift] = useState(0);

    useEffect(() => {
        if(currentDayId) {
            const dataFilter = schedules.filter((schedule) => schedule.day_week_id === currentDayId);
            if(dataFilter[0].shifts_venue_id !== 0 || null) {
                setIdShift(dataFilter[0].shifts_venue_id)
            }
        }
    }, [currentDayId, assingSameHour, schedules])

    const handleChangeShift = (e) => {
        const dataId = e.target.value;

        const [shiftData] = dataTurns.filter((turn) => turn.id === dataId);
        setIdShift(shiftData.id)
        
        if(assingSameHour) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(selectedDays.some((day) => day === schedule.day_week_id)) {
                    return {
                        ...schedule,
                        shifts_venue_id: shiftData.id,
                        start_time: shiftData.start_time,
                        end_time: shiftData.end_time,
                    }
                }
                return schedule
            }))
        } else {
            setSchedules(schedules => schedules.map((schedule) => {
                if(schedule.day_week_id === currentDayId) {
                    return {
                        ...schedule,
                        shifts_venue_id: shiftData.id,
                        start_time: shiftData.start_time,
                        end_time: shiftData.end_time,
                    }
                }
                return schedule
            }))
        }
    }

    return (  
        <>
            {currentDayId || assingSameHour ? (
                <div className="mt-4">
                    <FormControl variant="outlined">
                        <InputLabel id='select'>{t('FormProfessional.SelectTurns')}</InputLabel>
                        <Select labelId='select' label={t('FormProfessional.SelectTurns')}
                            value={idShift}
                            name="shifts_venue_id"
                            onChange={handleChangeShift}
                        >
                            {dataTurns && dataTurns.map((turn) => (
                                <MenuItem key={turn.name} value={turn.id}>
                                    {`${turn.name}: ${formatToHHMM(turn.start_time)} - ${formatToHHMM(turn.end_time)}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            ) : ''}
        </>
    );
}

export default FormScheduleWithTurns;
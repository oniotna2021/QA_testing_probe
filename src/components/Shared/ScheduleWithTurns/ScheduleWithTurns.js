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
import FormScheduleWithTurns from 'components/Shared/ScheduleWithTurns/FormScheduleWithTurns';
import ScheduleButtonWithTurns from 'components/Shared/ScheduleWithTurns/ScheduleButtonWithTurns';

//Services
import { getShiftsByVenue } from 'services/Reservations/shiftsVenue';

//utils
import { errorToast, mapErrors } from 'utils/misc';

const ScheduleWithTurns = ({ title, setDataSuccess, dataSuccess, currentVenueId, defaultValues=[], setSchedules, schedules }) => {

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation()

    const [loading, setLoading] = useState(false);
    const [dataTurns, setDataTurns] = useState([])
    const [selectedDays, setSelectedDays] = useState([]);
    const [currentDayId, setCurrentDay] = useState(0);
    const [assingSameHour, setAssingSameHour] = useState(false);

    useEffect(() => {
        setLoading(true)
        getShiftsByVenue(currentVenueId).then(({ data }) => {
            if (data && data.status === 'success' && data.data.shifts && data.data.shifts.length > 0) {
                setDataTurns(data?.data?.shifts);
            } else {
                if ( data.status === 'error') {
                    enqueueSnackbar(mapErrors(data?.data), errorToast);
                }
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        }).finally(() => {
            setLoading(true)
        })
    }, [enqueueSnackbar, setDataTurns, currentVenueId])

    useEffect(() => {
        if(defaultValues.length !== 0 && dataSuccess) {
            setSchedules(schedules => schedules.map((schedule) => {
                if(defaultValues.some((p) => p.day_week_id === schedule.day_week_id)) {
                    const dataToUpdate = defaultValues.find((p) => p.day_week_id === schedule.day_week_id)
                    return {
                        ...schedule,
                        shifts_venue_id: dataToUpdate.shifts_venue_id,
                        start_time: dataToUpdate.start_time,
                        end_time: dataToUpdate.end_time,
                    }
                }
                return schedule;
            }))
            setDataSuccess(false)
        }
    }, [dataSuccess, defaultValues, setSchedules, setDataSuccess])

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

            <div className="mt-4 py-2">
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
                            <Typography variant="body2 text-center">{t('FormProfessional.CheckAssingSameTurn')}</Typography>
                        </div>
                    </div>
                </div>
            </div>
        
            <div className="d-flex">
                { loading === 0 ? <Loading />
                    : schedules && schedules.map((day) => (
                        <ScheduleButtonWithTurns assingSameHour={assingSameHour} currentDayId={currentDayId} dayData={day} selectedDays={selectedDays} handleClick={handleClickDay} key={day.day_week_id} >
                            {day.name}
                        </ScheduleButtonWithTurns>
                    ))
                }
            </div>

            {dataTurns && (
                <div className="mb-4">
                    <FormScheduleWithTurns dataTurns={dataTurns} selectedDays={selectedDays} assingSameHour={assingSameHour} currentDayId={currentDayId} schedules={schedules} setSchedules={setSchedules} />
                </div>
            )}
        </>
    );
}

export default ScheduleWithTurns;
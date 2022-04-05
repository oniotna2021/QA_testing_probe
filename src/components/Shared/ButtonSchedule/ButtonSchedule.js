import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';

//UI
import Button from '@material-ui/core/Button'

//COMPONENTS
import Loading from 'components/Shared/Loading/Loading'

//UIILS
import { useStyles } from 'utils/useStyles'

//SERVICES
import { getDayWeek } from 'services/MedicalSoftware/DailyFood';

import { errorToast, mapErrors } from 'utils/misc';

const ButtonSchedule = ({ selectedDay, setSelectedDay }) => {

    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [dayWeek, setDayWeek] = useState([])
    const [loadData, setLoadData] = useState(false)

    useEffect(()=>{
        setLoadData(true)
        getDayWeek().then(({ data }) => {
            if(data && data.status === 'success' && data.data.items.length > 0)
                setDayWeek(data.data.items)
                setLoadData(false)
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    },[enqueueSnackbar]);

    return(
        loadData ? <div className='d-flex justify-content-center'><Loading /></div> :
        <React.Fragment>
        {dayWeek.map((itemDay, idx)=>(
            <Button className={selectedDay === itemDay.id ? classes.buttonScheduleSelected : classes.buttonSchedule} key={itemDay.id} onClick={()=> setSelectedDay(itemDay.id)}> {itemDay.name.slice(0, 3)} </Button>
        ))}
        </React.Fragment>
    )
}

export default ButtonSchedule
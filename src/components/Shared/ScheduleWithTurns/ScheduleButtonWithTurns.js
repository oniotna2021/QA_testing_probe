import React from 'react'

//UI
import { useStyles } from 'utils/useStyles';
import { ButtonBase } from '@material-ui/core';

const ScheduleButtonWithTurns = ({handleClick, dayData, currentDayId, assingSameHour, selectedDays }) => {

    const classes = useStyles();

    const renderColorSelect = () => {
        let arrClassNames = [];

        if(dayData) {
            if(dayData?.shifts_venue_id > 0) {
                arrClassNames.push(classes.buttonDayCalendarWithDuration)
            }
            
            if(currentDayId === dayData.day_week_id) {
                arrClassNames.push(classes.buttonDayCalendarSelect)
            };

            if(assingSameHour) {
                if(selectedDays.some((days) => days === dayData.day_week_id)) {
                    arrClassNames.push(classes.buttonDayCalendarSelect)
                } 
            }
        }
        
        return arrClassNames.join(' ')
    }

    return (  
        <ButtonBase onClick={handleClick} value={dayData?.day_week_id} className={`${renderColorSelect()} ${classes.buttonDayCalendar}`}>
            {dayData?.name}
        </ButtonBase>
    );
}

export default ScheduleButtonWithTurns;
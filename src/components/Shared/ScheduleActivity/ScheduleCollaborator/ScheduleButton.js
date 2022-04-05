import React from 'react'
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next'

//UI
import { useStyles } from 'utils/useStyles';
import { ButtonBase } from '@material-ui/core';

const ScheduleButton = ({handleClick, dayData, currentDayId, assingSameHour, selectedDays }) => {

    const { t } = useTranslation()
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const renderColorSelect = () => {
        let arrClassNames = [];

        if(dayData) {
            if(dayData?.start_time?.length > 0 || dayData?.end_time?.length > 0) {
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

    const handleClickButton = (e) => {
        if(dayData.start_time === null || dayData?.end_time === null) {
            enqueueSnackbar(t('FormNovelty.WarningClickDayWeek'), {variant: 'info', autoHideDuration: 2500});
            return;
        }

        handleClick(e);
    }

    return (  
        <ButtonBase onClick={handleClickButton} value={dayData?.day_week_id} className={`${renderColorSelect()} ${classes.buttonDayCalendarWithCollaborator}`}>
            {dayData?.name}
        </ButtonBase>
    );
}

export default ScheduleButton;
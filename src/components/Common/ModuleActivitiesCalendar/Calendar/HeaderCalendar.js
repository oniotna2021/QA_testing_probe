import React from 'react';
import { format, addDays, subDays, addMonths, subMonths } from 'date-fns';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { es } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

// UI
import Button from '@material-ui/core/Button';

// Utils
import { useStyles } from 'utils/useStyles'

const HeaderCalendar = ({ isFullCalendar, currentDate, setCurrentDate, setFetchReload }) => {
    
    const dateFormat = "PP";
    const { t } = useTranslation();
    const classes = useStyles();

    //METHODS
    const nextDay = () => {
        setCurrentDate(addDays(currentDate, 1));
        setFetchReload(true);
    };
    const prevDay = () => {
        setCurrentDate(subDays(currentDate, 1));
        setFetchReload(true);
    };

    // Next/Prev Month 
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
        setFetchReload(true);
    };
    
    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
        setFetchReload(true);
    };
    

    return (
        <div className="header row flex-end m-0 align-items-center" style={{width: '20rem', marginTop: '10px'}}>
            { isFullCalendar === 'true' ? (
                <div className="d-flex">
                    <div className="me-4">
                        <Button onClick={prevMonth} className={classes.buttonCalendar}>{t('DetailCollaborator.CalendarPrevMonth')}</Button>
                    </div>

                    <Button onClick={nextMonth} className={classes.buttonCalendar}>{t('DetailCollaborator.CalendarNextMonth')}</Button>
                </div>
            ) : (
                <>
                    <div className="col-2 d-flex justify-content-start">
                        <div className="icon pointer" onClick={prevDay}>
                            <ArrowBackIosIcon />
                        </div>
                    </div>
                    <div className="col-6 d-flex justify-content-center">
                        <span> {format(currentDate, dateFormat, { locale: es })} </span>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                        <div className="icon pointer" onClick={nextDay}>
                            <ArrowForwardIosIcon />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default HeaderCalendar;
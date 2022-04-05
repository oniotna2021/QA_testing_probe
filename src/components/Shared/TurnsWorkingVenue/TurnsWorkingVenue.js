import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI
import Typography from '@material-ui/core/Typography';
import { IconBigCalendar } from 'assets/icons/customize/config';
import IconButton from '@material-ui/core/IconButton';

// conmponents
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import { FormVenueTurnsWorking } from 'components/Common/ModuleConfigReservations/Venues/FormsVenue';

import { useStyles } from 'utils/useStyles';

const modalProps = {
    backgroundColorButtonClose:"white", colorButtonClose:"#000", fullWidth:true, width:'xs', padding: '10px',
}

const ScheduleVenue = ({idVenue}) => {

    const { t } = useTranslation();
    const classes = useStyles();

    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleChangeIsEdit = () => {
        setIsEdit(true);
        setIsOpen(true)
    }

    const handleCloseModal = () => {
        setIsEdit(false);
        setIsOpen(false)
    }

    return (  
        <>
            <div className={`${classes.containerIconButtonHome}`} onClick={handleChangeIsEdit}>
                <IconButton className={``} variant="outlined" size="medium">
                    <IconBigCalendar color="#3C3C3B" width="50" height="50" />
                </IconButton>

                <Typography className={classes.fontCardSchedule} variant="body3">{t('HomeTrainingPlans.TurnsWorking')}</Typography>
            </div>

            <ShardComponentModal {...modalProps} body={<FormVenueTurnsWorking idVenue={idVenue} isEdit={isEdit} setIsOpen={setIsOpen} />} isOpen={isOpen} handleClose={handleCloseModal} title={isEdit ? t('ListVenues.InputEditVenueTurnsWorking') : t('ListVenues.InputCreateVenueSchedule')} />
        </>
    );
}

export default ScheduleVenue;
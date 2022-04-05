import React from 'react';
import { addDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

// UI
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { useStyles } from 'utils/useStyles';

const dateFormat = "PP";

const ItemsSchedules = ({item, handleChange}) => {

    const classes = useStyles();

    const startDateFormat = item.start_date ? item.start_date.split(' ') : null;
    const endDateFormat = item.end_date ? item.end_date.split(' ') : null;

    return (  
        <div key={item.id} className={`mt-2 d-flex justify-content-between align-items-center p-2 ${classes.boxResultsSchedulesToEnable}`}>
            <Typography variant='body1'>{format(addDays(new Date(startDateFormat[0]), 1), dateFormat, { locale: es })} <b className="bold">{startDateFormat[1]}</b> / {format(addDays(new Date(endDateFormat[0]), 1), dateFormat, { locale: es })} <b className="bold">{endDateFormat[1]}</b> </Typography>
            
            <Checkbox
                name="selected"
                checkedIcon={<CheckBoxIcon style={{color: '#858585'}} />}
                onChange={(e) => handleChange(e, item.id)}
                checked={item.checked ? item.checked : false}
                color="default"
            />
        </div>  
    );
}

export default ItemsSchedules;
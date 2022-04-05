import React from 'react';
import { useTranslation } from 'react-i18next'

// UI
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

// Components
import ItemsSchedules from './ItemsSchedules';

// Utils
import { useStyles } from 'utils/useStyles';

const ItemResultsSearch = ({ handleChange, dataSearch, loading }) => {

    const { t } = useTranslation();
    const classes = useStyles();

    return (  
        <>
            {(loading || dataSearch.length > 0) && (
                <div className="mt-4 d-flex justify-content-between">
                    <Typography className={classes.fontGray} variant='body1'>{t('FormEnable.ResultsLabel')}</Typography>

                    <Typography className={classes.fontGray} variant='body1'>{`${dataSearch.length} ${t('FormEnable.ItemsResultsLabel')}`}</Typography>
                </div>
            )}

            { loading ? (
                <>
                    <Skeleton animation="wave" height={70} />
                    <Skeleton animation="wave" height={70} />
                    <Skeleton animation="wave" height={70} />
                </>
            ) : (
                dataSearch && dataSearch.map((item) => (
                    <ItemsSchedules key={item.id} item={item} handleChange={handleChange} />
                ))
            )}
        </>
    );
}

export default ItemResultsSearch;
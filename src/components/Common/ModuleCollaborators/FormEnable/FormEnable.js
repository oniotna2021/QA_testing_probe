import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useSnackbar } from "notistack";
import { connect } from 'react-redux';
import { format, isBefore } from 'date-fns/esm';

// UI
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

// Components
import DatePicker from 'components/Shared/DatePicker/DatePicker';
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave'
import useTimeValuePicker from 'hooks/useTimeValuePicker';
import ItemResultsSearch from './ItemResultsSearch';

// Services
import { getSchedulesToEnableByDate, deleteNewsEmployee } from 'services/Reservations/activitiesUser';

// Utils
import { useStyles } from 'utils/useStyles';
import { infoToast, errorToast, mapErrors, successToast } from 'utils/misc';

const FormEnable = ({ title, setIsOpen, userId, handleClose, venueId }) => {

    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const classes = useStyles();

    const [dataSearch, setDataSearch] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    const [valueTime, handleChangeDate] = useTimeValuePicker();

    const handleClickSearch = () => {
        if(valueTime.start_date === null && valueTime.end_date === null) {
            enqueueSnackbar(t('Message.AlertFields'), infoToast);
            return;
        }

        const formatDateStart = format(valueTime.start_date, 'yyyy-MM-dd')
        const formatDateEnd = format(valueTime.end_date, 'yyyy-MM-dd')
        
        if(isBefore(new Date(formatDateEnd), new Date(formatDateStart))) {
            enqueueSnackbar(t('FormNovelty.WarningInvalidInterval'), infoToast);
            return;
        }

        setLoadingData(true);
        getSchedulesToEnableByDate(userId, formatDateStart, formatDateEnd, venueId).then(({data}) => {
            if (data && data?.status === 'success' && data?.data?.length > 0) {
                setDataSearch(data.data)
            } else {
                if (data.status === 'error') {
                    enqueueSnackbar(mapErrors(data?.data), errorToast);
                    return;
                }

                enqueueSnackbar(t('FormEnable.WarningResultsEmpty'), infoToast);
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        }).finally(() => {
            setLoadingData(false)
        })
    }

    const handleSubmit = () => {
        if(!dataSearch.some(p => p.checked === true)) {
            enqueueSnackbar(t('FormEnable.WarningSelected'), infoToast);
            return;
        }

        const dataFilter = dataSearch.filter(p => p.checked === true)
        const dataMap = dataFilter.map((p) => (p.id));
    
        setLoading(true);
        deleteNewsEmployee(dataMap.toString()).then(({data}) => {
            if (data && data?.status === 'success' && data?.data) {
                enqueueSnackbar(t('FormEnable.SuccessMessage'), successToast);
                handleClose();
            } else {
                if (data.status === 'error') {
                    enqueueSnackbar(mapErrors(data), errorToast);
                    return;
                }
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleClick = () => {
        if(dataSearch.length > 0) {
            handleSubmit();
            return;
        }
        handleClickSearch();
    }

    const handleClickCancel = () => {
        if(dataSearch.length > 0) {
            handleClickSearch();
            return;
        }

        setIsOpen(false)
    }

    const handleChangeScheduleToEnabled = (e, idItem) => {
        setDataSearch(data => data.map((item) => {
            if(item.id === idItem) {
                return {...item, checked: e.target.checked }
            }

            return item;
        }))
    }

    return (  
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                { title && <Typography variant="h6">{title}</Typography>}
                <IconButton style={{backgroundColor: 'white', color: '#000',}} onClick={() => setIsOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </div>

            <Typography variant='body1'>{t('FormEnable.Description')}</Typography>

            <div className="d-flex justify-content-between mt-4">
                <FormControl variant="outlined" className="me-2" >
                    <DatePicker 
                        id="date-picker"
                        value={valueTime.start_date}
                        onChange={date => handleChangeDate(date, 'start_date')} 
                        placeholder="AAAA/MM/DD"
                    />
                </FormControl>

                <FormControl variant="outlined">
                    <DatePicker 
                        id="date-picker"
                        value={valueTime.end_date}
                        onChange={date => handleChangeDate(date, 'end_date')} 
                        placeholder="AAAA/MM/DD"
                    />
                </FormControl>
            </div>

            <div>
                <ItemResultsSearch loading={loadingData} handleChange={handleChangeScheduleToEnabled} dataSearch={dataSearch} />
            </div>

            <div className='d-flex justify-content-between mt-4'>
                <>
                    <Button onClick={handleClickCancel} fullWidth className={dataSearch.length === 0 ? classes.buttonBlock : classes.buttonReasing}>{dataSearch.length === 0 ? t('Btn.Cancel') : t('Btn.TryConsult')}</Button>
                    <ButtonSave type='button' onClick={handleClick} loader={loading} fullWidth={true} text={dataSearch.length === 0 ? t('Btn.Search') : t('Btn.Apply')}/>
                </>  
            </div>
        </>
    );
}

const mapStateToProps = ({ auth }) => ({
    venueId: auth.venueIdDefaultProfile,
});

export default connect(
    mapStateToProps
)(FormEnable);
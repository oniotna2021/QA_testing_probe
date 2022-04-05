import { useEffect, useMemo, useState } from 'react'

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Swal from 'sweetalert2';

// COMPONENTS
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave';
import Loading from 'components/Shared/Loading/Loading';

 //Imports
import { useSnackbar } from 'notistack';

//TRANSLATE
import { useTranslation } from 'react-i18next';

// SERVICES
import { getQuoteById } from 'services/MedicalSoftware/Quotes';
import { deleteAppointment } from 'services/MedicalSoftware/Appointments';

 //Utils
import { errorToast, mapErrors, checkVariable } from 'utils/misc';

const FormDeleteAppointment = ({ idQuote, setIsOpen, setFetchReload }) => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [isFetching, setIsFetching] = useState(false);
    const [dataQuote, setDataQuote] = useState({})

    useEffect(() => {
        setIsFetching(true);
        getQuoteById(idQuote).then(({ data }) => {
            if (data.status === 'success' && data.data) {
                setDataQuote(data.data);
                setIsFetching(false);
            } else {
                if (data.status === 'error'){
                    enqueueSnackbar(mapErrors(data.data), errorToast);
                }
        }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [idQuote, enqueueSnackbar])

    const checkStatus = useMemo(() => {
        if(Object.keys(dataQuote).length > 0) {
            let isActive = dataQuote?.is_active;
            let isStarted = dataQuote?.is_started;
            let isFinished = dataQuote?.is_finished;

            return isFinished 
                    ? 'Finalizada' 
                    : isStarted  
                        ? 'Iniciada' 
                        : isActive 
                            ? 'Activa'
                            : 'Desactivada'
        }

        return '----';
    }, [dataQuote]);

    const deleteForm = () => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cancelar cita'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsFetching(true)
                deleteAppointment(idQuote).then(req => {
                    if (req.data.status === 'error') {
                        Swal.fire({
                            title: 'No se ha eliminado la cita',
                            text: `${mapErrors(req.data)}`,
                            icon: 'error'
                        })
                        setIsFetching(false)
                    }
                    else {
                        Swal.fire(
                            '¡Eliminado!',
                            'Su cita ha sido cancelada.',
                            'success'
                        )
                        setFetchReload(true);
                        setIsFetching(false);
                        setIsOpen(false);
                    }
                }).catch((err) => {
                    enqueueSnackbar(mapErrors(err), errorToast);
                    setIsFetching(false)
                })
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
            setIsFetching(false)
        })
    }

    return (
        <Card>
            <div className='d-flex justify-content-between mb-5'>
                <Typography variant='h6'>{t('FormDeleteApointment.Appointmentinformation')}</Typography>
                <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
            </div>
            <div className='row'>
                {isFetching && Object.keys(dataQuote).length === 0
                    ? <Loading />
                    : (
                        <>
                            <div className='d-flex flex-column'>
                                <div className='d-flex justify-content-between'>
                                    <Typography className="me-4"><b>{t('FormDeleteApointment.Patient')}</b></Typography> 
                                    <Typography noWrap={true}>{`${checkVariable(dataQuote?.client_first_name)} ${checkVariable(dataQuote?.client_last_name)}`}</Typography>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography className="me-4"><b>{t('FormDeleteApointment.DocumentNumber')}</b></Typography> 
                                    <Typography noWrap={true}>{`${checkVariable(dataQuote?.["number-document"])}`}</Typography>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography><b>{t('FormDeleteApointment.Doctor')}</b></Typography>
                                    <Typography noWrap={true}>{`${checkVariable(dataQuote?.medical_professional_first_name)} ${checkVariable(dataQuote?.medical_professional_last_name)}`}</Typography>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography><b>{t('FormDeleteApointment.Date')}</b></Typography><Typography>{checkVariable(dataQuote?.date)}</Typography>

                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography><b>{t('NutritionPlan.FormNutrition.InputHour')}</b></Typography> <Typography>{checkVariable(dataQuote?.hour)}</Typography>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography><b>{t('MedicalSuggestions.InputTypeQuote')}</b></Typography> <Typography>{checkVariable(dataQuote?.type_quote_name)}</Typography>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <Typography><b>{t('MedicalSuggestions.StatusQuote')}</b></Typography> <Typography>{checkStatus}</Typography>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
            <div className='d-flex justify-content-end mt-3 mb-4'>
                <ButtonSave onClick={deleteForm} typeButton="button" loader={isFetching} text={t('Btn.CancelQuote')} />
            </div>
        </Card>
    )
}

export default FormDeleteAppointment

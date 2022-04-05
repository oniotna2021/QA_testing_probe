import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

// Ui
import Typography from '@material-ui/core/Typography';

// Components
import Loading from 'components/Shared/Loading/Loading';
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave';
import ButtonModalForm from 'components/Shared/ButtonModalForm/ButtonModalForm';
import FormTurns from './FormTurns';

//Services
import { getShiftsByVenue } from 'services/Reservations/shiftsVenue';

//utils
import { errorToast, mapErrors} from 'utils/misc';

const FormVenueTurnsWorking = ({idVenue, setIsOpen}) => {

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation()

    const [load, setLoad] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [idItem, setIdItem] = useState('');
    const [turns, setTurns] = useState([]);
    
    useEffect(() => {
        if(load) {
            getShiftsByVenue(idVenue).then(({ data }) => {
                if (data && data.status === 'success' && data.data.shifts) {
                    setTurns(data.data.shifts);
                } else {
                    if ( data.status === 'error' ) {
                        enqueueSnackbar(mapErrors(data.data), errorToast);
                    }
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            }).finally(() => {
                setLoad(false);
            })
        }
    }, [enqueueSnackbar, idVenue, load])

    const handleClick = (id) => {
        if(id === 0) {
            setOpenForm(true)
            setIsEdit(false)
        } else {
            setOpenForm(true)
            setIdItem(id)
            setIsEdit(true)
        }
    }

    return (  
        <>
            {!openForm && <Typography variant="body2">{t('FormVenueTurnsWorking.Description')}</Typography>}

            {!openForm && 
                <div className="mb-4">
                    <ButtonModalForm idM={0} onClick={handleClick} title={t('FormVenueTurnsWorking.ButtonCreateTurn')} />
                </div> 
            }

            {openForm && (
                <FormTurns setLoad={setLoad} setOpenForm={setOpenForm} idVenue={idVenue} isEdit={isEdit} setIsEdit={setIsEdit} setIdItem={setIdItem} idItem={idItem} />
            )}

            {!openForm && (
                load ? <Loading /> 
                : (
                    <div className="d-flex flex-column mb-4">
                        {turns && turns.map((turn) =>
                            <ButtonModalForm bgColor="#ffff" color={theme.palette.black.light} key={turn.id} idM={turn.uuid} onClick={handleClick} title={turn.name} isEdit={true} />
                        )}
                    </div>
                )
            )}

            {!openForm && (
                <div className="d-flex justify-content-end mt-3">
                    <ButtonSave style={{width: '200px'}} typeButton="button" onClick={() => setIsOpen(false)} text={isEdit ? t('Btn.saveChanges') : t('Btn.save')} />
                </div>
            )}
        </>
    );
}

export default FormVenueTurnsWorking;
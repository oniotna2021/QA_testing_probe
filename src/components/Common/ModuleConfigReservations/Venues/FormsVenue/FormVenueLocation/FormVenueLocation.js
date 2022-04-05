import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@material-ui/core/styles';

// Components
import Loading from 'components/Shared/Loading/Loading';
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave';
import ButtonModalForm from 'components/Shared/ButtonModalForm/ButtonModalForm';
import FormLocation from './FormLocation';

//Services
import { getLocationByVenue } from 'services/Reservations/location';

//utils
import { errorToast, mapErrors} from 'utils/misc';

const FormVenueLocation = ({idVenue, setIsOpen, files}) => {

    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation()

    const [load, setLoad] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [idItem, setIdItem] = useState('');
    const [locations, setLocations] = useState([]);
    
    useEffect(() => {
        if(load) {
            getLocationByVenue(idVenue).then(({ data }) => {
                if (data && data.status === 'success' && data.data && data.data.length > 0) {
                    setLocations(data.data);
                } else {
                    if ( data.status === 'error'){
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
        console.log(id)
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
            {!openForm && 
                <div className="mb-4">
                    <ButtonModalForm idM={0} onClick={handleClick} title={t('ListVenues.InputCreateVenueLocation')} />
                </div> 
            }

            {openForm && (
                <FormLocation files={files} setLoad={setLoad} setOpenForm={setOpenForm} idVenue={idVenue} isEdit={isEdit} setIsEdit={setIsEdit} setIdItem={setIdItem} idItem={idItem} />
            )}

            {!openForm && (
                load ? <Loading /> 
                : (
                    <div className="d-flex flex-column mb-4">
                        {locations && locations.map((location) =>
                            <ButtonModalForm bgColor="#ffff" color={theme.palette.black.light} key={location.location_id} idM={location.location_has_venue_id} onClick={handleClick} url_image={location?.url_image} title={location.name} isEdit={true} />
                        )}
                    </div>
                )
            )}

            {!openForm && (
                <div className="d-flex justify-content-end mt-3">
                    <ButtonSave typeButton="button" onClick={() => setIsOpen(false)} text={isEdit ? t('Btn.saveChanges') : t('Btn.save')} />
                </div>
            )}
        </>
    );
}

export default FormVenueLocation;
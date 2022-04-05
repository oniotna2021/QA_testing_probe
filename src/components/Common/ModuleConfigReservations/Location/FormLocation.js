import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import slugify from 'slugify';
import { useTranslation } from 'react-i18next'

//UI
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

//Components
import DropzoneImage from 'components/Shared/DropzoneImage/DropzoneImage';
import ButtonSave from 'components/Shared/ButtonSave/ButtonSave';

//Services
import { postLocation, putLocation } from 'services/Reservations/location';
import { getAllLocationCategory } from 'services/Reservations/locationCategory';

//utils
import { successToast, errorToast, mapErrors, infoToast} from 'utils/misc';

import { setFormData } from 'utils/misc';

export const FormLocation = ({isEdit, dataItem, defaultValue, setExpanded, setLoad, files, setFiles}) => {
    
    const { t } = useTranslation()
    const { handleSubmit, control, formState: {errors} } = useForm({
        defaultValues: {} 
    });
    const { enqueueSnackbar } = useSnackbar()
    const [loadingFetch, setLoadingFetch] = useState(false)
    const [dataCategories, setDataCategories] = useState([]);

    useEffect(() => {
        getAllLocationCategory().then(({ data }) => {
            if (data && data.status === 'success' && data.data && data.data.length > 0) {
                setDataCategories(data.data);
            } else {
                if ( data.status === 'error' ) {
                    enqueueSnackbar(mapErrors(data.data), errorToast);
                }
            }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar])

    const onSubmit = (data) => {
        if(!files[0] && !isEdit) {
            enqueueSnackbar(t('ListLocation.WarningInputImageLocationRequired'), infoToast);
            return;
        }

        const dataForm = {
            ...data,
            image_location: files[0],
            description: 'je',
        }
        
        setLoadingFetch(true)
        const functionCall = isEdit ? putLocation : postLocation;
        functionCall(isEdit ? dataForm : setFormData(dataForm), dataItem?.uuid)
            .then(({ data }) => {
                if (data && data.message && data.status === 'success') {
                    setExpanded(false);
                    enqueueSnackbar(t('SportsHistory.SaveForms'), successToast)
                    setLoad(true)
                } else {
                    enqueueSnackbar(data.message, errorToast)
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
            .finally(() => {
                setLoadingFetch(false)
                setFiles([])
            })
    }

    return (
        <form  onSubmit={handleSubmit(onSubmit)}>
            <div className="container">
                <div class="row justify-content-center">
                    {!isEdit && (
                        <div class="col-2 d-flex align-items-center">
                            <DropzoneImage files={files} setFiles={setFiles} />
                        </div>
                    )}
                    
                    <div className="col">
                        <div className="row">
                            <div className={`col-6`}>
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="name"
                                    defaultValue={defaultValue?.name}
                                    render={({ field }) => (
                                        <FormControl variant="outlined">
                                            <TextField
                                                    {...field}
                                                    fullWidth
                                                    id={slugify('name', { lower: true })}
                                                    type='text'
                                                    label={t('ListLocation.InputName')}
                                                    rows={1}
                                                    variant="outlined"
                                                />
                                            {errors.name && <FormHelperText error>Campo requerido</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                            </div>

                            <div className="col-6">
                                <Controller
                                    rules={{ required: true }}
                                    control={control}
                                    name="location_category_id"
                                    defaultValue={defaultValue?.location_category_id}
                                    render={({ field }) => (
                                        <FormControl variant="outlined">
                                            <InputLabel>
                                                {t('ListLocation.InputTypeLocation')}
                                            </InputLabel>
                                            <Select
                                                    {...field}
                                                    fullWidth
                                                    id={slugify('type_activity_id', { lower: true })}
                                                    label={t('ListLocation.InputTypeLocation')}
                                                    variant="outlined"
                                                    onChange={(e) => { field.onChange(parseInt(e.target.value)); }}
                                                >
                                                    {dataCategories && dataCategories.map((category) => (
                                                        <MenuItem value={`${category.id}`} key={category.id} >{category.name}</MenuItem>
                                                    ))}
                                            </Select>
                                            {errors.type_activity_id && <FormHelperText error>Campo requerido</FormHelperText>}
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>   
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <ButtonSave text={t('Btn.save')} loader={loadingFetch}/>
                    </div>
                </div>
            </div>
        </form>
    )
}
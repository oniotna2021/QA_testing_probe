import React from 'react'
import { CommonComponentSimpleForm } from '../../../Shared/SimpleForm/SimpleForm';
import { LinkTypesForm } from '../../../../config/Forms/MedicalForms';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { useForm } from 'react-hook-form';
import { postLinkTypes, putLinkTypes, deleteLinkTypes } from '../../../../services/MedicalSoftware/LinkTypes';
import Swal from 'sweetalert2';

//TRANSLATE
import { useTranslation } from 'react-i18next'

export const FormMainManage = ({type, defaultValue, setExpanded}) => {
    
    const {t} = useTranslation()
    const { handleSubmit, control, reset } = useForm();

    const onSubmit = (data) => {
       if(type === 'Nuevo'){
            postLinkTypes(data).then(req => {
                if (req.status === 200) {
                    setExpanded(false);
                    reset();
                }
            });
       }else{
            putLinkTypes(data, defaultValue.id).then(req => {
                if (req.status === 200) {
                    setExpanded(false)
                }
            });
       }
    }

    const deleteForm = () => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, bórralo!'
          }).then((result) => {
            if (result.isConfirmed) {
                deleteLinkTypes(defaultValue.id).then(req => {
                    Swal.fire(
                        '¡Eliminado!',
                        'Su registro ha sido eliminado.',
                        'success'
                      )
                });
            }
          })
    }
    
    return (
        <form  onSubmit={handleSubmit(onSubmit)}>
            { type !== 'Nuevo' &&
                <div className="row justify-content-end mb-3">
                    <div className="col-1">
                    <Button color="primary" fullWidth variant="outlined" onClick={deleteForm}><DeleteIcon /></Button>
                    </div>
                </div>
            }
            <CommonComponentSimpleForm form={LinkTypesForm} control={control} defaultValue={defaultValue}/>
            <div className="row gx-3 justify-content-end">
                <div className="col-2">
                    <Button color="primary" fullWidth variant="contained" type="submit">{t('Btn.save')}</Button>
                </div>
            </div>
        </form>
    )
}
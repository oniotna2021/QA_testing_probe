import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CommonComponentSimpleForm } from '../../../Shared/SimpleForm/SimpleForm';
import { Controller } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
import { 
        NewMainForms, 
        NewTypeMainForms, 
        NewMainFormsTwo, 
        NewEntityMainForms,
        NewEntityMedicalProfileForms
        } from '../../../../config/Forms/MainForms';
import Typography from '@material-ui/core/Typography';
import { CommonComponentAccordion } from '../../../Shared/Accordion/Accordion';
import { CommonComponentSimpleSelect } from '../../../Shared/SimpleSelect/SimpleSelect';
import { getFieldType, getDataType } from '../../../../services/MedicalSoftware/FieldType';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CommonComponentMultiSelect } from 'components/Shared/MultiSelect/MultiSelect';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';

//IMPORTS
import { useSnackbar } from 'notistack';

//TRANSLATE
import { useTranslation } from 'react-i18next'

//UTILS
import { errorToast, mapErrors } from 'utils/misc';


export const FormMain = () => {

    const {t} = useTranslation()
    const { enqueueSnackbar } = useSnackbar();
    const { handleSubmit, control } = useForm();
    const [expanded, setExpanded] = useState(false);
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState([]);
    const [cssClass, setCssClass] = useState('col-12');
    const [requeridFiled, setRequeridFiled] = useState(false);
    const [customForm, setCustomForm] = useState([]);

    const [selected, setSelected] = useState(false);

    useEffect(() => {
        getFieldType().then(({ data }) => {
            if (data.status === 'success' && data.data && data.data.length > 0) {
                setData(data.data);
            } else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar])


    useEffect(() => {
        getDataType().then(({ data }) => {
            if (data.status === 'success' && data.data && data.data.length > 0) {
                setDataType(data.data);
            } else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
        })
    }, [enqueueSnackbar])

    const onSubmit = (value) => {
        setCustomForm([...customForm, value])
        // let temp = {
        //         "name": "informacion_basica",
        //         "description": null,
        //         "is_active": 1,
        //         "slug": "fase_1",
        //         "customInputFields": [value]
        // }
        // console.log(customForm);
    }
    const MedilaProfile = [
        {
            id: 1,
            name: 'Medico General'
        },
        {
            id: 2,
            name: 'Nutricionista'
        },
        {
            id: 3,
            name: 'Reumatologo'
        }
    ];

    const handleRemoveItem = (e) => {
        
    };
    
    return (
            <div className="container">
                <div className="row gx-3">
                    <div className="col">
                        <div className="row">
                            <Typography variant="h4">{t('FromManage.CreateForm')}</Typography>
                        </div>

                        {/*<div className="row mt-4">
                        <CommonComponentSimpleForm form={MainForms} control={control} />
                        </div>*/}

                        <div className="row mt-3">
                            <Typography variant="h5">{t('FromManage.ManageFields')}</Typography>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row mt-4">
                            <div className="col">
                                <CommonComponentAccordion expanded={expanded} setExpanded={setExpanded} title_no_data={t('FromManage.Accordion.TitleNoData')} form={
                                    (
                                    <div className="row gx-2">
                                        <CommonComponentSimpleForm row={false} form={NewMainForms} control={control} />
                                        <CommonComponentSimpleSelect form={NewTypeMainForms} option={data} control={control} setSelected={setSelected}  />
                                        { selected && selected !== 10 ?
                                            <CommonComponentSimpleForm row={false} form={NewMainFormsTwo} control={control} />
                                        :
                                            <CommonComponentSimpleSelect form={NewEntityMainForms} option={dataType} control={control} />

                                        }
                                        <div className="row gx-2">
                                            <div className="col">
                                                <CommonComponentMultiSelect form={NewEntityMedicalProfileForms} dataSelect={MedilaProfile} control={control}  />
                                            </div>
                                        </div> 
                                        <div className="row gx-2">
                                            <div className="col-4">
                                                <Typography variant="body2">{t('FromManage.FieldSize')}</Typography>
                                                <Controller
                                                    control={control}
                                                    name="class"
                                                    value={cssClass}
                                                    defaultValue={cssClass}
                                                    render={({
                                                        field
                                                    }) =>(
                                                        <ButtonGroup {...field} color="primary" className="mt-1" size="large" fullWidth aria-label="primary button group">
                                                            <Button onClick={() => {setCssClass('col-4'); field.onChange('col-4');}} variant={cssClass === 'col-4' ? 'contained' : 'outlined'}>1/3</Button>
                                                            <Button onClick={() => {setCssClass('col-6'); field.onChange('col-6');}} variant={cssClass === 'col-6' ? 'contained' : 'outlined'}>1/2</Button>
                                                            <Button onClick={() =>  {setCssClass('col-12'); field.onChange('col-12');}} variant={cssClass === 'col-12' ? 'contained' : 'outlined'}>1</Button>
                                                        </ButtonGroup>
                                                    )}
                                                />
                                            </div>
                                            <div className="col">
                                            <Typography variant="body2">{t('FromManage.IsMandatory')}</Typography>
                                            <Controller
                                                    control={control}
                                                    name="is_required"
                                                    value={requeridFiled}
                                                    defaultValue={requeridFiled}
                                                    render={({
                                                        field
                                                    }) =>(
                                                        <Button {...field} fullWidth size="large" className="mt-1" color="primary" onClick={() => {setRequeridFiled(!requeridFiled); field.onChange(!requeridFiled);}} variant={requeridFiled ? 'contained' : 'outlined'}>{t('FromManage.Required')}</Button>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-2">
                                            </div>
                                            <div className="col">
                                                <Button color="primary" size="large" className="mt-4" fullWidth variant="contained" type="submit">{t('Btn.save')}</Button>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                } />
                            </div>
                        </div>
                        </form>
                        <div className="row mt-4">
                            <div className="col">
                            <TableContainer component={Paper}>
                                <Table  size="small" aria-label="a dense table">
                                    <TableHead>
                                    <TableRow>
                                        <TableCell>{t('WeeklyNutrition.InputName')}</TableCell>
                                        <TableCell align="center">{t('FromManage.TableCell.NameSystem')}</TableCell>
                                        <TableCell align="center">{t('FromManage.TableCell.FieldType')}</TableCell>
                                        <TableCell align="center">{t('FromManage.TableCell.MedicalProfile')}</TableCell>
                                        <TableCell align="center">{t('FromManage.TableCell.Restriction')}</TableCell>
                                        <TableCell align="center">{t('Btn.Delete')}</TableCell>

                                    </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {customForm && customForm.map((row, idx) => (
                                        <TableRow key={`${row.name}-${idx}`}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="center">{row.slug}</TableCell>
                                        <TableCell align="center">{row.input_field_type_id}</TableCell>
                                        <TableCell align="center">{row.medical_profiles.map((medical) => (`${medical}, `))}</TableCell>
                                        <TableCell align="center"><Button color="primary" size="small" fullWidth variant={row.is_required ? 'contained' : 'outlined'} >{t('FromManage.Required')}</Button></TableCell>
                                        <TableCell align="center"><Button color="primary" size="small" fullWidth variant="contained" onClick={handleRemoveItem}><DeleteIcon /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </TableContainer>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
    )
}

const mapStateToProps = ({ auth }) => ({
    isLoggingIn: auth.isLoggingIn,
});

export default connect(
    mapStateToProps
)(FormMain);
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { getMainAll } from '../../../../services/MedicalSoftware/MainService';
import { CommonComponentAccordion } from '../../../Shared/Accordion/Accordion';
import {MessageView} from '../../../Shared/MessageView/MessageView';
import { FormMainManage } from '../MainManage/MainManage';

//IMPORTS
import { useSnackbar } from 'notistack';

//UTILS
import { errorToast, mapErrors } from 'utils/misc';

export const ListMainMedical = () => {

    const { id } = useParams();
    const [expanded, setExpanded] = useState(false);

    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [tablename, setTableName] = useState('');

    useEffect(() => {
        getMainAll(id).then(({ data }) => {
            if (data.status === 'success' && data.data && data.data.length > 0) {
                setData(data.data);
                setTableName(data.table_name)

            }else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
       })
    }, [data])

    return (
        <div className="container">
            <div className="row gx-3">
                <div className="col">
                    <div className="row">
                        <div className="col-8">
                            <Typography variant="h4">{tablename}</Typography>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <TextField
                                variant="outlined"
                                label="Buscar"
                            />
                        </div>
                    </div>                
                        <div className="row mt-4">
                            <div className="col">
                            <div className="row mt-3">
                                    <div className="col">
                                        <CommonComponentAccordion expanded={expanded} setExpanded={setExpanded} title_no_data={`Crear un nuevo ${tablename}`}  form={<FormMainManage type='Nuevo' setExpanded={setExpanded} />} />
                                    </div>
                                </div>
                                {data.length === 0
                                ?
                                <MessageView label="No hay Datos"/>
                                :
                                <div className="row mt-3">
                                    <div className="col">
                                        {data.map((row) => (
                                            <CommonComponentAccordion expanded={expanded} setExpanded={setExpanded} key={`${row.id}`} data={row} form={<FormMainManage type='Editar' defaultValue={row} setExpanded={setExpanded} />} />
                                        ))}
                                    </div>
                                </div>
                                }
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
)(ListMainMedical);
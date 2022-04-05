import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

// UI
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';

// Components
import { FormTypeAppointment } from 'components/Common/ModuleMedical/Manage/TypeAppointment/FormTypeAppointment';
import {MessageView} from 'components/Shared/MessageView/MessageView';
import { CommonComponentAccordion } from 'components/Shared/Accordion/Accordion';
import Loading from 'components/Shared/Loading/Loading';

//IMPORTS
import { useSnackbar } from 'notistack';

//UTILS
import { errorToast, mapErrors } from 'utils/misc';

//Hooks
import useSearchable from 'hooks/useSearchable';

// Service
import { getTypeAppointment } from 'services/MedicalSoftware/TypeAppointment';

export const ListTypeAppointment = () => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);
    const [fecthData, setFetchData] = useState(false);
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false)

    //Search
    const [term, setTerm] = useState('');
    const searchableData = useSearchable(
        data,
        term,
        (l) => [l.name]
    );

    useEffect(() => {
        setFetchData(true);
        getTypeAppointment().then(({ data }) => {
            setFetchData(false);
            if (data && data.status === 'success' && data.data && data.data.length > 0) {
                setData(data.data);
            } else {
                if ( data.status === 'error') {
                    enqueueSnackbar(mapErrors(data.data), errorToast);
                }
          }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
       })
    }, [load, enqueueSnackbar ])

    return (
        <div className="container">
          {fecthData ?
            <Loading />
            :
            <div className="row gx-3">
                <div className="col">
                    <div className="row">
                        <div className="col-8">
                            <Typography variant="h4">{t('ListTypeAppointment.TitleTypeAppointment')}</Typography>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <TextField
                                    variant="outlined"
                                    onChange={({ target }) => setTerm(target.value)}
                                    value={term}
                                    label={t('Search.Placeholder')}
                                />
                        </div>
                    </div>

                        <div className="row mt-4">
                            <div className="col">
                                <div className="row mt-3">
                                    <div className="col">
                                        <CommonComponentAccordion
                                            color="primary"
                                            expanded={expanded}
                                            setExpanded={setExpanded}
                                            title_no_data={t('ListTypeAppointment.CreateNewTypeAppointment')}
                                            form={<FormTypeAppointment type='Nuevo'
                                                setExpanded={setExpanded} load={load} setLoad={setLoad}/>
                                            }
                                        />
                                    </div>
                                </div>
                                {data.length === 0
                                ?
                                <MessageView label={t('ListPermissions.NoData')}/>
                                :
                                <div className="row mt-3">
                                    <div className="col">
                                        {searchableData
                                            .map((row) => (
                                                <CommonComponentAccordion
                                                    expanded={expanded}
                                                    setExpanded={setExpanded}
                                                    key={`${row.id}`}
                                                    data={row}
                                                    form={<FormTypeAppointment type='Editar' defaultValue={row} setExpanded={setExpanded} 
                                                    load={load} setLoad={setLoad}/>} />
                                            ))}  
                                    </div>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
            </div>
            }
        </div>
    )
}

const mapStateToProps = ({ auth }) => ({
    isLoggingIn: auth.isLoggingIn,
});

export default connect(
    mapStateToProps
)(ListTypeAppointment);
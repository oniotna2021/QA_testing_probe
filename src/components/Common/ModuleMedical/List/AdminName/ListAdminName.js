import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

// UI
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';

// Components
import { FormAdminName } from 'components/Common/ModuleMedical/Manage/AdminName/FormAdminName';
import {MessageView} from 'components/Shared/MessageView/MessageView';
import { CommonComponentAccordion } from 'components/Shared/Accordion/Accordion';
import Loading from 'components/Shared/Loading/Loading';

//Hooks
import useSearchable from 'hooks/useSearchable';

//IMPORTS
import { useSnackbar } from 'notistack';

 //UTILS
 import { errorToast, mapErrors } from 'utils/misc';

// Service
import { getAdminName } from 'services/MedicalSoftware/AdminName';

export const ListAdminName = () => {

    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const [fecthData, setFetchData] = useState(false);
    const [load, setLoad] = useState(false)
    const [data, setData] = useState([]);

    //Search
    const [term, setTerm] = useState('');
    const searchableData = useSearchable(
        data,
        term,
        (l) => [l.name]
    );

    useEffect(() => {
        setFetchData(true);
        getAdminName().then(({ data }) => {
            setFetchData(false);
            if (data && data.status === 'success' && data.data && data.data.items.length > 0) {
                setData(data.data.items);
            } else {
                enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }).catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
       }) 
    }, [load])

    return (
        <div className="container">
        {fecthData ?
            <Loading />
            :
            <div className="row gx-3">
                <div className="col">
                    <div className="row">
                        <div className="col-8">
                            <Typography variant="h4">{t('ListAdminName.AdminName')}</Typography>
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
                                            title_no_data={t('ListAdminName.CreateNewNameAdmin')}
                                            form={<FormAdminName  load={load} setLoad={setLoad} type='Nuevo'
                                                setExpanded={setExpanded} />
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
                                                    form={<FormAdminName load={load} setLoad={setLoad} type='Editar' defaultValue={row} setExpanded={setExpanded} />} />
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
)(ListAdminName);
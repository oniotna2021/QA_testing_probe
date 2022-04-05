import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

//Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//internal dependencies
import { setInitsForm } from 'modules/sessions';

//UI
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Pagination from '@material-ui/lab/Pagination';

//Components 
import ItemContentResumeSession from '../../ModuleSession/ItemContentResumeSession/ItemContentResumeSession';
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import Loading from 'components/Shared/Loading/Loading'

//SERVICES
import { getSessionsForTrainer } from 'services/TrainingPlan/Sessions'

//ICONS
import { IconEyeView } from 'assets/icons/customize/config'

//UTILS
import { useStyles } from 'utils/useStyles'
import { errorToast, mapErrors, dataSourceGetFieldSessions } from 'utils/misc';

//Service
import { searchElastic } from 'services/_elastic';
//Hooks
import useDebounce from 'hooks/useDebounce';
import usePagination from 'hooks/usePagination';


//internal dependencies
import { addSessionInSelection, setEditingSessionInPlan, setStepForm } from 'modules/trainingPlan';

const SessionsList = ({ dataSessionsInList, addSessionInSelection, userId, setStepForm }) => {

    const [infoResumeSession, setInfoResumeSession] = useState('');
    const [openResumen, setOpenResumen] = useState('');
    const [isTrainerSessions, setIsTrainerSessions] = useState(1)
    const [dataSession, setDataSession] = useState([]);


    const classes = useStyles();
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    //Search
    const [term, setTerm] = useState('')
    const debouncedFilter = useDebounce(term, 500);
    const [fetchData, setFetchData] = useState(false)

    const itemsPerPage = 10;
    const { currentPage, handleChangePage, pages, setPages } = usePagination(itemsPerPage);


    useEffect(() => {
        setDataSession(dataSessionsInList || [])
    }, [dataSessionsInList])


    const hanldeOpenItemResumen = (value) => {
        setOpenResumen(true);
        if (value._source) {
            setInfoResumeSession(value._source);
        } else {
            setInfoResumeSession(value);
        }
    }

    const onAddItemToSelection = (value) => {
        window.scrollTo(0, 0);
        if (value._source) {
            addSessionInSelection(value._source)
        } else {
            addSessionInSelection(value)
        }
    }


    useEffect(() => {
        if (debouncedFilter !== '') {
            fetchDataApi();
        }
    }, [debouncedFilter, currentPage]);

    const fetchDataApi = () => {
        setFetchData(true);
        searchElastic('sessions', {
            from: (currentPage * 10) - 10,
            size: itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": debouncedFilter,
                                "fields": ['name'],
                                'fuzziness': '2'
                            }
                        },
                        {
                            "multi_match": {
                                "query": 0,
                                "fields": ['is_personalized']
                            }
                        }
                    ]
                }
            },
            "_source": dataSourceGetFieldSessions
        }
        ).then(({ data }) => {
            setFetchData(false);
            if (data.data) {
                setPages(data.data.hits.total.value);
                setDataSession(data.data.hits.hits);
            }
        }).catch((err) => {
            setPages(0)
            setFetchData(false);
        })
    }

    useEffect(() => {
        if (isTrainerSessions === 0) {
            getSessionsForTrainer(userId).then(({ data }) => {
                if (data && data.status === 'success' && data.data.items)
                    setDataSession(data.data.items)
                else {
                    if (data.status === 'error') {
                        enqueueSnackbar(mapErrors(data.data), errorToast);
                    }
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
        } else {
            setDataSession(dataSessionsInList)
        }
    }, [isTrainerSessions, enqueueSnackbar, userId])



    return (
        <React.Fragment>
            <ShardComponentModal
                title={t('ResumenSession.Title')}
                fullWidth={true}
                width={"md"}
                handleClose={() => setOpenResumen(false)}
                body={
                    <ItemContentResumeSession
                        infoResumeSession={infoResumeSession}
                        setIsOpen={setOpenResumen}
                        isDetailAffiliate={false}
                        isViewNoEdit={true} />
                } isOpen={openResumen} />

            <div className="container">
                <div className="row">

                    <div className="col-12 mt-3">
                        <div className="row">
                            <div className="col-6">
                                <Typography variant="h5">{t('Session.Title')}</Typography>
                            </div>
                            <div className="col-6 mt-2 d-flex justify-content-end">
                                <Typography className="cursor" variant="body2" onClick={() => setStepForm({ step: 0 })}>Volver a filtrar</Typography>
                            </div>
                        </div>
                        <br></br>
                        <Typography variant="body2">{t('TrainingPlan.title.SelectSeleccion')}</Typography>
                    </div>



                    <div className="col-6 mt-3">
                        <Button color={isTrainerSessions === 0 ? 'primary' : 'default'} onClick={() => setIsTrainerSessions(0)}>
                            <Typography variant="body2"><b>{t('Session.Title.My')}</b></Typography>
                        </Button>
                    </div>

                    <div className="col-6 mt-3 d-flex justify-content-end">
                        <Button color={isTrainerSessions === 1 ? 'primary' : 'default'} onClick={() => setIsTrainerSessions(1)}>
                            <Typography variant="body2"><b>{t('Session.Title.OthersSessions')}</b></Typography>
                        </Button>
                    </div>


                    <div className="col-12 mt-2">
                        <TextField
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={({ target }) => setTerm(target.value)}
                            value={term}
                            label={t('Search.Placeholder')}
                        />
                    </div>


                    <div className="col-12 mt-3">
                        {fetchData ? <Loading /> :
                            <List>
                                {dataSession.map((item, index) => (
                                    <Card key={`item-session-for-selection` + index} style={{ margin: '20px 0px', padding: 10 }}>
                                        <ListItem>
                                            <ListItemText
                                                primary={item?.name || item._source?.name}
                                            />
                                            <ListItemSecondaryAction>
                                                <div className='d-flex justify-content-between align-items-center'>
                                                    <IconButton className={classes.iconButton} style={{ padding: 8 }} onClick={() => hanldeOpenItemResumen(item._source || item)} >
                                                        <IconEyeView />
                                                    </IconButton>
                                                    <IconButton className={classes.iconButton} edge="end" aria-label="add" onClick={() => onAddItemToSelection(item)}>
                                                        <ArrowForwardIosIcon style={{ fontSize: 10 }} />
                                                    </IconButton>
                                                </div>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Card>
                                ))}
                            </List>
                        }



                        {!fetchData &&
                            <div className="d-flex justify-content-end">
                                <div className={classes.paginationStyle}>
                                    <Pagination shape="rounded"
                                        count={pages}
                                        page={currentPage}
                                        onChange={handleChangePage}
                                        size="large"
                                    />
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}


const mapStateToProps = ({ trainingPlan, auth }) => ({
    dataSessionsInList: trainingPlan.dataSessionsInList,
    userId: auth.userId,
});


const mapDispatchToProps = dispatch => bindActionCreators({
    addSessionInSelection,
    setInitsForm,
    setEditingSessionInPlan,
    setStepForm
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SessionsList);


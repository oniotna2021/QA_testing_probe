import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

//UI
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

//Action Redux
import { addExercises } from 'modules/sessions';

//Components
import Loading from 'components/Shared/Loading/Loading';
import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import FormIndicateNumber from '../FormIndicateNumber/FormIndicateNumber';
import DetailExercises from 'components/Common/ModuleConfig/List/Exercises/DetailExercises';
import FramePreviewVideo from 'components/Shared/PreviewVideo/FramePreviewVideo'
import VideoPlayer from 'components/Shared/VideoPlayer/VideoPlayer';
import ControlledAutocompleteChip from 'components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip'


//Service
import { searchElastic } from 'services/_elastic';

//Icons
import IconTime from 'assets/icons/diagram/iconTime.svg';

// Hooks
import { generateQueryElasticExerciceTags } from 'hooks/_elasticQuerys';


// Utils
import { errorToast } from 'utils/misc';

const SearchExercises = ({ label, addExercises, training_step_id_selected, training_step_id, trainingStepsSelected, brandId }) => {

    const { enqueueSnackbar } = useSnackbar();
    const [openPlayer, setOpenPlayer] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
 /*   const [term, setTerm] = useState('');
    const debouncedFilter = useDebounce(term, 500);*/
    const { t } = useTranslation();
    const { control, watch } = useForm();
    const watchTags = watch("searchExerciceTag", false);


    /**State repetitions */
    const [isOpenModalRepetitions, setIsOpenModalRepetitions] = useState(false);
    const [numberRepetitions, setNumberRepetitions] = useState(0);
    const [dataExercicesAditional, setDataExercicesAditional] = useState(0);

    const [timeApply, setTimeApply] = useState(0);
    const [numberDurationApply, setNumberDurationApply] = useState(0);

    const [itemAddTemporary, setItemAddTemporary] = useState('');

    /* State modal video */
    const [dataVideo, setDataVideo] = useState({})

    useEffect(() => {
        if (watchTags && watchTags.length > 0) {
            setFilterValue(watchTags)
        } else {
            setOptions([]);
        }
    }, [watchTags]);


    useEffect(() => {
        setFilterValue(['a'], 10)
    }, []);


    /**ANALIZA CUANDO EL MODAL CIERRA
     *  PARA AÑADIR EN EL STATE GLOBAL EL ITEM CON LA REPETICIONES */
    useEffect(() => {
        if (!isOpenModalRepetitions && itemAddTemporary && dataExercicesAditional && dataExercicesAditional.numberRepeat) {
            itemAddTemporary._source.number_repetitions = dataExercicesAditional.numberRepeat;
            itemAddTemporary._source.time_apply = timeApply
            itemAddTemporary._source.numberDurationApply = dataExercicesAditional.timeCalculate;
            itemAddTemporary._source.type_time_repetition = dataExercicesAditional.type_time_repetition;
            itemAddTemporary._source.perception_effort = dataExercicesAditional.perception_effort;
            addExercises(itemAddTemporary);
        }
    }, [isOpenModalRepetitions]);


    const setFilterValue = (value, sizeTotal = 50) => {
        setLoading(true);
        setOptions([]);
        if (value) {
            searchElastic('exercises',
                {
                    from: 0,
                    size: sizeTotal,
                    "query": {
                        "bool": {
                            "must": generateQueryElasticExerciceTags(value, brandId),
                            "filter":{
                                "terms":{
                                    "brand_videos": Number(brandId) === 1 ? ["1","3","4","5"] : ["2", "3"]
                                }
                            }
                        }
                    }
                }
            ).then(({ data }) => {
                if (data && data.data) {
                    setOptions(data.data.hits.hits)
                } else {
                    setOptions([]);
                }
                setLoading(false);
            }).catch((err) => {
                setLoading(false);
                setOptions([]);
            })
        } else {
            setOptions([]);
            setLoading(false);
        }
    }

    const handlerAddExercises = (item) => {
        if (trainingStepsSelected.length > 0 && training_step_id !== 0) {
            setNumberRepetitions(0);
            setIsOpenModalRepetitions(true);
            setItemAddTemporary(item);
        } else {
            enqueueSnackbar('Por favor agregar una etapa para agregar este ejercicio', errorToast);
        }
    }

    const handleClickVideoPreview = (item) => {
        setDataVideo(item)
        setOpenPlayer(true)
    }

    const handleClose = () => {
        setIsOpenModalRepetitions(false)
        setDataExercicesAditional(null)
    }

    return (
        <>
            <ShardComponentModal
                title={t('Repetitions.title')}
                handleClose={handleClose}
                body={<FormIndicateNumber
                    isRepetitions={true}
                    itemAddTemporary={itemAddTemporary}
                    timeApply={timeApply}
                    setTimeApply={setTimeApply}
                    training_step_id_selected={training_step_id_selected}
                    setNumberDurationApply={setNumberDurationApply}
                    onClose={() => setIsOpenModalRepetitions(false)}
                    setDataExercicesAditional={(event) => setDataExercicesAditional(event)}
                />
                }
                isOpen={isOpenModalRepetitions}
            />
            <ShardComponentModal
                title={dataVideo ? dataVideo?._source?.name : ''}
                fullWidth={true}
                width={"sm"}
                handleClose={() => setOpenPlayer(false)}
                body={
                    <div className="row noMarginAndPadd" >
                        <div className="col-md-12">
                            <VideoPlayer
                                src={dataVideo ? process.env.REACT_APP_VIDEOS_EXERCICES + 'Verticales/' + dataVideo?._source?.video_url : ''}
                            />
                        </div>
                        <div className="col-md-12">
                            <DetailExercises
                                onViewVideo={null}
                                data={dataVideo?._source}
                                userType={null}
                                isView={true}
                                setExpanded={''}
                                reload={''}
                                setReload={''}
                            />
                        </div>
                    </div>
                }
                isOpen={openPlayer}
            />

            <ControlledAutocompleteChip
                control={control}
                options={[]}
                name='searchExerciceTag'
                className='mt-4'
            />
            {/*<TextField
                className="mt-4"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={({ target }) => setTerm(target.value)}
                value={term}
                label={label}
            />*/}
            <Typography variant="body2" style={{ fontSize: 12, marginTop: 5 }}>
                {t('TrainingPlan.searchExerciceDescription')}
            </Typography>

            {loading &&
                <Loading />
            }
            <Paper className="scrollSearchExeciceList">
                <List >
                    {options.map(item =>
                        <Card
                            key={`item-exercies-` + item._id}
                            style={{ margin: '10px 0px' }}
                        >
                            <div className='row m-0'>
                                <div className='col-md-3 p-0 cursor' onClick={() => { handleClickVideoPreview(item) }}>
                                    <FramePreviewVideo
                                        thumbnailImageSrc={process.env.REACT_APP_IMAGES_EXERCICES + item._source.image_desktop}
                                        videoSrc={process.env.REACT_APP_VIDEOS_EXERCICES + 'Verticales/' + item._source.video_url}
                                    />
                                </div>
                                <div
                                    className="col-md-9 d-flex align-items-center cursor justify-content-around"
                                    onClick={() => handlerAddExercises(item)}
                                >
                                    <div className='col-md-6'>
                                        <Tooltip arrow title={item._source.name} placement="top">
                                            <Typography
                                                style={{ marginLeft: 20 }}
                                                variant="body2"
                                                className="textEllipsis"><b>{item._source.name}</b>
                                            </Typography>
                                        </Tooltip>
                                    </div>
                                    <div className='col-md-6 d-flex justify-content-end p-0 me-3'>
                                        <img src={IconTime} style={{ marginRight: 5 }} alt="" />
                                        <span style={{
                                            margin: '10px 0px',
                                            fontSize: 13,
                                            width: 50
                                        }} >{item._source.duration}’</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </List>
            </Paper>
        </>
    )
}

const mapStateToProps = ({ common, sessions, auth }) => ({
    exercisesAdd: sessions.exercisesAdd,
    training_step_id: sessions.training_step_id,
    training_step_id_selected: sessions.training_step_id_selected,
    trainingStepsSelected: common.trainingStepsSelected,
    brandId: auth.brandId
});

const mapDispatchToProps = dispatch => bindActionCreators({
    addExercises,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchExercises);

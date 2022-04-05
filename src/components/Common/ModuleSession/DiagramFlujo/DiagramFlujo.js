import React, { useEffect, useState } from 'react';

//Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import OptionsTypeTraining from 'components/Shared/OptionsTypeTraining/OptionsTypeTraining';

// Modules
import { setStepOption, removeExercices } from 'modules/sessions';
import { reorderTrainingSteps, editDiagramTrainingStep } from 'modules/common';

//import Diagram from 'beautiful-react-diagrams';
import ReactFlow, { addEdge, Controls, Background, removeElements } from 'react-flow-renderer';

//UI
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton'

//Components
import { CustomNodeSerie, CustomNode } from './IndexNodesDiagramFlow';

import { ShardComponentModal } from 'components/Shared/Modal/Modal';
import FormIndicateNumber from '../FormIndicateNumber/FormIndicateNumber';
import ViewDiagramForList from '../ViewDiagramForList/ViewDiagramForList';
import Loading from 'components/Shared/Loading/Loading';
import ConnectionLine from './ConnectionLine';

//Internal dependencies
import {
    errorToast, normalizeDataNodesSave, generateUUIDConsecutive
} from 'utils/misc';

//Styles
import { DefaultOptions } from './DiagramFlujo.style';


//Icons
import IconSerie from 'assets/icons/diagram/iconSerie.svg';
import IconViewList from 'assets/icons/diagram/iconViewListSession.svg';

const DiagramFlujo = ({ trainingStepsSelected, exercisesAdd, training_step_id, training_step_name, setStepOption, editDiagramTrainingStep, removeExercices }) => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [loadingSteps, setLoadingSteps] = useState(false);
    const [elements, setElements] = useState([]);
    const [rfInstance, setRfInstance] = useState(null);

    useEffect(() => {
        if (trainingStepsSelected.length > 0 && training_step_id !== 0) {
            const findStep = trainingStepsSelected.find((t) => t._id === training_step_id)
            const dataElements = findStep?.diagram?.elements;
            const newDataSet = (dataElements || []).map(e => {
                if (!e.id.includes('port-add-serie') && e.data && e.data.data && !e.data.data.funcOnEditExercice) {
                    return {
                        ...e,
                        data: {
                            ...e.data,
                            funcOnEditExercice: editNodeFromChema,
                        }
                    };
                }
                return e
            })
            setElements(newDataSet)
        }
    }, [trainingStepsSelected, training_step_id])


    const onConnect = (params) => {
        const elementEdge = { ...params, arrowHeadType: 'arrowclosed', style: { fontWeight: 500, strokeWidth: '2.5' } };
       // console.log(params);
        //Validation conection for serie
        if (params.target.includes('port-add-serie')) {
            const dataNormalize = normalizeDataNodesSave(elements);
            const validationConectionSerie = dataNormalize.filter(x => {
                const validation = x.exercises.some(item => item.id_port === params.source);
                return validation ? true : false;
            });
            if (validationConectionSerie.length > 0) {
                enqueueSnackbar('Lo sentimos el ejercicio ya hace parte de una serie', errorToast);
                return;
            }
        }

        setElements((els) => addEdge(elementEdge, els))
        editDiagramTrainingStep(training_step_id, addEdge(elementEdge, elements))
    };

    const onElementsRemove = (elementsToRemove) => {
        setElements((els) => removeElements(elementsToRemove, els))
        editDiagramTrainingStep(training_step_id, removeElements(elementsToRemove, elements))
    };

    const findLastPositionNode = () => {
        const dataElementInstance = rfInstance?.toObject().elements;
        if (dataElementInstance?.length > 0 && rfInstance) {
            const arrKeys = dataElementInstance.map(el => {
                if (el.position) {
                    return true;
                }
                return false;
            });
            return dataElementInstance[arrKeys.lastIndexOf(true)]
        }

        return [];
    }

    const onUpdateElementNgnx = (newNode) => {
        if (rfInstance) {
            const dataElementInstance = rfInstance?.toObject().elements;
            setElements(dataElementInstance.concat(newNode))
            editDiagramTrainingStep(training_step_id, dataElementInstance.concat(newNode))
        }
    }

    const onNodeDragStop = () => {
        if (rfInstance) {
            editDiagramTrainingStep(training_step_id, rfInstance.getElements())
        }
    }

    const duplicateNodeSerie = (value) => {
        const idNode = `port-${String(value.data.id + '-' + Math.random())}`;
        const newNode = {
            id: idNode,
            type: 'serie',
            data: { id: idNode, name: value.data.name, data: value.data, funcSerie: value.funcSerie },
            style: { border: 'none', padding: 10, width: value.data.id === 'add-serie' ? 100 : 190, background: 'transparent' },
            position: {
                x: Object.keys(findLastPositionNode()).length > 0 ? (findLastPositionNode()?.position?.x + 180) : 500,
                y: Object.keys(findLastPositionNode()).length > 0 ? (findLastPositionNode()?.position?.y) : 200
            },
        };
        onUpdateElementNgnx(newNode)
    };



    const onAdd = (value) => {
        const idNode = value.id === 'add-serie' ? `port-${String(value.id + '-' + Math.random())}` : `port-exercises-${generateUUIDConsecutive(elements.length)}-${value.id}`;
        const idNodeUnique = value.id !== 'add-serie' ? `${generateUUIDConsecutive(elements.length)}-${value.id}` : null;
        const newNode = {
            id: idNode,
            type: value.id === 'add-serie' ? 'serie' : 'exercise',
            data: {
                id: idNode, name: value.name,
                data: { ...value, id_port: idNode, idNodeUnique },
                funcSerie: duplicateNodeSerie,
                funcOnEditExercice: editNodeFromChema
            },
            style: { border: 'none', padding: 10, width: value.id === 'add-serie' ? 100 : 190, background: 'transparent' },
            position: {
                x: Object.keys(findLastPositionNode()).length > 0 ? (findLastPositionNode()?.position?.x + 180) : 500,
                y: Object.keys(findLastPositionNode()).length > 0 ? (findLastPositionNode()?.position?.y) : 200
            },
        };

        setElements(els => els.concat(newNode))
        editDiagramTrainingStep(training_step_id, elements.concat(newNode))
    };

    const defutOptions = [
        {
            id: 'add-serie',
            content: 'Agregar serie'
        }
    ]

    /**State series */
    const [numberSeries, setNumberSeries] = useState(null);
    const [isOpenModalSeries, setIsOpenModalSeries] = useState(false);
    const [isOpenModalManageUpdate, setIsOpenModalManageUpdate] = useState(false);
    const [dataPiramidal, setDataPiramidal] = useState(false);
    const [timeApply, setTimeApply] = useState(0);

    /**State time */
    const [numberBreak, setNumberBreak] = useState(null);
    const [itemAddTemporary, setItemAddTemporary] = useState('');


    /**View Resume Step */
    const [viewStatusResumeStep, setViewStatusResumeStep] = useState(false);
    const [dataResumeStep, setDataResumeStep] = useState({});


    useEffect(() => {
        if (exercisesAdd && Object.keys(exercisesAdd).length > 0 && exercisesAdd._source) {
            onAdd(exercisesAdd._source);
            removeExercices();
        }
    }, [exercisesAdd])

    /**ANALIZA CUANDO EL MODAL CIERRA
    *  PARA AÑADIR EN EL STATE GOBLAL EL ITEM DE SERIE */
    useEffect(() => {
        if (!isOpenModalSeries && itemAddTemporary && (numberSeries && numberSeries >= 0) && numberBreak >= 0) {
            itemAddTemporary.number_series = numberSeries;
            itemAddTemporary.time_off = numberBreak;
            itemAddTemporary.apply_pyramidal = dataPiramidal.apply_pyramidal ?? false;
            itemAddTemporary.pyramidal_increase_element_weight = dataPiramidal.pyramidal_increase_element_weight ?? 0;
            itemAddTemporary.pyramidal_increase_repetitions = dataPiramidal.pyramidal_increase_repetitions ?? 0;
            onAdd(itemAddTemporary);
        }
    }, [!isOpenModalSeries]);



    const editNodeFromChema = (data) => {
        setNumberSeries(data.number_repetitions);
        setNumberBreak(data.duration);
        setTimeApply(data.time_apply);
        setItemAddTemporary(data);
        setIsOpenModalManageUpdate(true);
    }


    const manageUpdateItemDiagram = (value) => {
        const newDataSet = elements.map((e) => {
            if (e.id !== itemAddTemporary.id_port) {
                return e;
            }
            return {
                ...e,
                data: {
                    data: {
                        ...e.data.data,
                        number_repetitions: Number(value.numberRepeat),
                        time_apply: value.time_apply,
                        numberDurationApply: value.timeCalculate,
                        type_time_repetition: value.type_time_repetition,
                        name: itemAddTemporary.name
                    },
                    funcOnEditExercice: editNodeFromChema,
                    name: itemAddTemporary.name
                }
            };
        })
        setElements(newDataSet);
        editDiagramTrainingStep(training_step_id, newDataSet)
    }

    const addItemSecondary = (value) => {
        const nodesFilter = elements.filter(x => !x.id.includes('port-add-serie'));
        if (nodesFilter.length > 0) {
            setNumberSeries(0);
            setItemAddTemporary(value)
            setIsOpenModalSeries(true);
        } else {
            enqueueSnackbar(nodesFilter.length > 0 ? 'Por favor seleccionar ejercicios para crear serie' : 'Por favor elanzar un ejercicio para agregar una serie', errorToast);
        }
    }

    const handleTypeTraining = (value) => {
        if (rfInstance) {
            const flow = rfInstance.toObject().elements;
            editDiagramTrainingStep(training_step_id, flow)
        }
        setStepOption({ training_step: value });
    }


    const handlerViewDiagramForList = () => {
        const dataNormalize = normalizeDataNodesSave(elements);
        setDataResumeStep(dataNormalize);
        setViewStatusResumeStep(true);
    }

    return (
        <div style={{ height: '70vh' }}>


            <ShardComponentModal
                title={t('Repetitions.title')}
                handleClose={() => setIsOpenModalManageUpdate(false)}
                body={
                    <FormIndicateNumber
                        isRepetitions={isOpenModalManageUpdate}
                        timeApply={timeApply}
                        setTimeApply={setTimeApply}
                        itemAddTemporary={isOpenModalManageUpdate && itemAddTemporary ? { _source: itemAddTemporary } : ''}
                        onClose={() => setIsOpenModalManageUpdate(false)}
                        numberSeries={numberSeries}
                        numberBreak={numberBreak}
                        manageUpdateItemDiagram={(event) => manageUpdateItemDiagram(event)}
                    />
                }
                isOpen={isOpenModalManageUpdate}
            />


            <ShardComponentModal
                title={''}
                fullWidth={true}
                width={'sm'}
                handleClose={null}
                body={
                    <ViewDiagramForList
                        dataResumeStep={dataResumeStep}
                        training_step_name={training_step_name}
                        handleClose={() => setViewStatusResumeStep(false)}
                    />}
                isOpen={viewStatusResumeStep}
            />


            <ShardComponentModal
                title={t('Series.title')}
                handleClose={() => setIsOpenModalSeries(false)}
                body={
                    <FormIndicateNumber
                        onClose={() => setIsOpenModalSeries(false)}
                        numberSeries={''}
                        numberBreak={''}
                        isSerieAdd={true}
                        setNumberBreak={(event) => setNumberBreak(event)}
                        setNumberSeries={(event) => setNumberSeries(event)}
                        setDataPiramidal={(event) => setDataPiramidal(event)}
                        timeApply={timeApply}
                        setTimeApply={setTimeApply}
                    />
                }
                isOpen={isOpenModalSeries}
            />



            <DefaultOptions isViewOptionsSecondary={trainingStepsSelected.length > 0 && training_step_id !== 0}>
                {defutOptions.map(item => {
                    return <Card
                        onClick={() => addItemSecondary({ name: item.content, id: item.id })}
                        key={'default-option-' + item.id}
                        style={{ margin: '60px 10px', padding: '0px 30px' }} >
                        <p className="d-flex">
                            <img style={{ marginRight: 10 }} src={IconSerie} alt="" />
                            {item.content}
                        </p>
                    </Card>
                })}
            </DefaultOptions>


            <div className='mb-5'>
                <Typography
                    variant="h6"
                    className="textEllipsis"><b>{t('Create.Session.TitleTypeTrainig')}</b></Typography>
                <OptionsTypeTraining selectedOption={handleTypeTraining} />
            </div>



            {trainingStepsSelected.length > 0 && training_step_id !== 0 &&
                <IconButton className="btnViewListSession" onClick={handlerViewDiagramForList}>
                    <img src={IconViewList} alt="" />
                </IconButton>
            }


            {loadingSteps ? <Loading /> :
                trainingStepsSelected.length > 0 && (
                    <ReactFlow
                        elements={elements}
                        onElementsRemove={onElementsRemove}
                        onConnect={onConnect}
                        nodeTypes={{ exercise: CustomNode, serie: CustomNodeSerie }}
                        onLoad={setRfInstance}
                        onNodeDragStop={onNodeDragStop}
                        connectionLineComponent={ConnectionLine}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                )
            }
        </div >
    )
}

const mapStateToProps = ({ sessions, common }) => ({
    exercisesAdd: sessions.exercisesAdd,
    training_step_id: sessions.training_step_id,
    training_step_name: sessions.training_step_name,
    trainingStepsSelected: common.trainingStepsSelected,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setStepOption,
    reorderTrainingSteps,
    editDiagramTrainingStep,
    removeExercices
}, dispatch);


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(React.memo(DiagramFlujo));



import React, { useState, useEffect, useCallback } from 'react'


//Diagram Flow 
import ReactFlow, { Background, Controls } from 'react-flow-renderer';

//Components
import { CustomNodeSerie, CustomNode } from '../DiagramFlujo/IndexNodesDiagramFlow';
import ViewDiagramForList from '../ViewDiagramForList/ViewDiagramForList';
import { ShardComponentModal } from 'components/Shared/Modal/Modal';

//UI
import IconButton from '@material-ui/core/IconButton'

//Internal dependencies
import {
    normalizeDataNodesSave
} from 'utils/misc';

//Icons
import IconViewList from 'assets/icons/diagram/iconViewListSession.svg';

const ViewDiagramFlow = ({ data, training_step_name }) => {

    const [reactflowInstance, setReactflowInstance] = useState(null);

    /**View Resume Step */
    const [viewStatusResumeStep, setViewStatusResumeStep] = useState(false);
    const [dataResumeStep, setDataResumeStep] = useState({});

    const onLoad = useCallback(
        (rfi) => {
            if (!reactflowInstance) {
                setReactflowInstance(rfi);
            }
        },
        [reactflowInstance]
    );

    useEffect(() => {
        if (reactflowInstance && data && data[0].elements.length > 0) {
            reactflowInstance.fitView();
        }
    }, [reactflowInstance, data]);



    const handlerViewDiagramForList = () => {
        const dataNormalize = normalizeDataNodesSave(data[0].elements);
        setDataResumeStep(dataNormalize);
        setViewStatusResumeStep(true);
    }


    return data.length > 0 && data[0].elements && (
        <div style={{ height: '35vh', marginTop: 10 }}>

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

            <IconButton className="btnViewListSession" onClick={handlerViewDiagramForList}>
                <img src={IconViewList} alt="" />
            </IconButton>

            <ReactFlow
                onLoad={onLoad}
                className='containerFlowView'
                elements={data[0].elements}
                nodeTypes={{ exercise: CustomNode, serie: CustomNodeSerie }}
            >
                <Background />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    )
}

export default ViewDiagramFlow

import { Handle, Position } from 'react-flow-renderer';

//Componenets
import ItemExercisesFlujo from './ItemExercisesFlujo';


export const CustomNodeSerie = ({ data }) => {

    return (
        <div>
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    border: 'none',
                    width: '10px',
                    height: '10px',
                }}
            />

            <ItemExercisesFlujo
                id={data.id}
                content={data.name}
                data={{ data: data.data }}
                dataToDuplicate={data}
                onClickDuplicateSerie={data?.funcSerie}
            />
        </div>
    )
}

export const CustomNode = ({ data }) => {

    return (
        <div>
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    border: 'none',
                    width: '10px',
                    height: '10px',
                    backgroundColor: "#e68859"
                }}
                id="a"
            />

            <ItemExercisesFlujo
                id={data.id}
                content={data.name}
                data={{ data: data.data }}
                onClickEdit={data?.funcOnEditExercice}
            />

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    border: 'none',
                    width: '10px',
                    height: '10px',
                    backgroundColor: "#94b0ed"
                }}
                id="b"
            />
        </div>
    )
}
import React from 'react';

const ConnectionLine = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    connectionLineType,
    connectionLineStyle,
    }) => {
    return (
        <g>
        <path
            fill="none"
            stroke="#222"
            strokeWidth={2.5}
            className="animated"
            d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
        />
        </g>
    );
};

export default ConnectionLine;
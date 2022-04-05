import React from 'react'

//UI
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

//Icons
import IconExercice from 'assets/icons/diagram/iconExercice.svg';
import IconSerie from 'assets/icons/diagram/iconSerie.svg';

//Mic
import { getNameIntensityForCardio } from 'utils/misc';


const ItemExercisesFlujo = ({ id, content, data, dataToDuplicate, onClickDuplicateSerie, onClickEdit }) => {

    const isSerie = content === 'Agregar serie' ? true : false;

    const handleClickDuplicateSerie = () => {
        if (onClickDuplicateSerie) {
            onClickDuplicateSerie(dataToDuplicate)
        }
        return;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <Tooltip arrow title={
                <div>
                    {data?.data?.number_repetitions && <p><b>{data?.data?.time_apply ? data?.data?.numberDurationApply + '’’' : data?.data?.number_repetitions}</b> {data?.data?.time_apply ? data?.data?.type_time_repetition === 1 ? 'Minutos' : 'Segundos' : 'Repeticiones'} </p>}
                    {data?.data?.number_series && <p><b>{data?.data?.number_series}</b> Series</p>}
                    {data?.data?.duration && !data?.data?.time_apply && <p><b>{data?.data?.duration}’’</b> Duración</p>}
                    {(data?.data?.time_off || data?.data?.time_off === 0) && <p><b>{data?.data?.time_off}</b> Seg Descanso</p>}
                    {data?.data.perception_effort && <p><b> {'Intensidad: ' + getNameIntensityForCardio(data.data.perception_effort)}</b></p>}
                </div>
            } placement="top">
                <div className={content === 'Agregar serie' ? 'circuleUnionSession' : 'itemSessionFlujo'}>
                    {/*{
                        isSerie &&
                        <div className="contentPointforSerie">
                            {inputs.map((port, index) => React.cloneElement(port, { className: index === 0 ? 'circuleUnionCardSerieTop' : 'circuleUnionCardSerie' }))}
                        </div>
                    }*/}
                    {/**onClick={() => data.data.onClickEdit(data.data)} */}
                    {data?.data?.number_repetitions &&
                        <span className="bagdeRepetition" onClick={() => onClickEdit ? onClickEdit(data.data) : null}>
                            {data?.data?.time_apply ? data?.data?.numberDurationApply + '’' : data?.data?.number_repetitions}
                            {!data?.data?.time_apply && <img src={IconExercice} alt="" />}
                        </span>
                    }
                    <div className="textEllipsis" style={{
                        padding: !isSerie ? '0px 10px 0px' : 10
                    }}>
                        <div className="d-flex align-items-center">
                            {content === 'Descanso' ? data?.data?.time_off + '”' : content === 'Agregar serie' ? data?.data?.number_series : content}
                            {isSerie && <img className="iconSerie ms-2" src={IconSerie} alt="" />}
                            {isSerie && onClickDuplicateSerie && <AddIcon onClick={handleClickDuplicateSerie} className="ms-2" style={{ width: '15px', height: '15px' }} color="white" />}
                        </div>
                    </div>

                    {/* {!data.isView &&
                        <IconButton aria-label="close" onClick={() => deleteNodeFromSchema(id)}>
                            <CloseIcon style={{ fontSize: 14 }} />
                        </IconButton>
                    }*/}
                </div>
            </Tooltip>

        </div >
    )
}

export default ItemExercisesFlujo

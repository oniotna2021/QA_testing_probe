import React, { memo } from 'react';
//Redux
import { connect } from 'react-redux';

//UI
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const OptionsPlaceTraining = ({ option, handleOption, placesTraining }) => {

    return (
        <ToggleButtonGroup
            value={option}
            onChange={handleOption}
            aria-label="text alignment"
        >
            {placesTraining && placesTraining.map((item) =>
                <ToggleButton key={item.name} value={item.id} aria-label={item.name}>
                    {item.name}
                </ToggleButton>
            )}
        </ToggleButtonGroup>
    )
}



const mapStateToProps = ({ common }) => ({
    placesTraining: common.placesTraining
});


export default connect(
    mapStateToProps
)(memo(OptionsPlaceTraining));

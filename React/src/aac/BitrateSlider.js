import React from 'react';

function BitrateSlider(props) {
    return (
        <div id="fdk_cbr_div">
            <p>Set your desired bitrate via the slider:</p>
            <input type="range" onChange={props.sliderMoved} min="32" max="512" step="32" value={props.bitrate} id="fdk_slider" className="slider"/>
            <span id="fdkvalue">{` ${props.bitrate} kbps`}</span>
        </div>

    )
}

export default BitrateSlider;
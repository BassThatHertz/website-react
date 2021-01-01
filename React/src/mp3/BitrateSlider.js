import React from 'react'

function BitrateSlider(props) {
    return (
        <div id="mp3_slider_div">
            <p>Set your desired bitrate via the slider:</p>
            <input
                type="range" min="64" max="320" step="64"
                onChange={props.onMp3BitrateChange} value={props.bitrate} 
            />
            <span id="bitrateText">{` ${props.bitrate} kbps`}</span><br/><br/>
            <i>A higher bitrate allows for potentially higher audio quality, at the expense of a larger file size.</i>
        </div>
    );
}

export default BitrateSlider;
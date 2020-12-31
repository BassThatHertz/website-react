import React from 'react';

class BitrateSlider extends React.Component {
    componentDidMount() {
        document.getElementById('fdkvalue').innerHTML = '256 kbps'
    }
    render() {
        return (
            <div id="fdk_cbr_div">
                <p>Set your desired bitrate via the slider:</p>
                <input type="range" onChange={this.props.sliderMoved} min="32" max="512" step="32" value={this.props.bitrate} id="fdk_slider" className="slider"/>
                <span id="fdkvalue"></span>
            </div>
    
        )
    }
}

export default BitrateSlider;
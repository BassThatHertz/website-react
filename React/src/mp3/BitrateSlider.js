import React from 'react'

class BitrateSlider extends React.Component {
    componentDidMount() {
        document.getElementById('bitrateText').innerHTML = '192 kbps'
    }

    render() {
        const onMp3BitrateChange = this.props.onMp3BitrateChange
        const bitrate = this.props.bitrate
        return (
            <div id="mp3_slider_div">
                <p>Set your desired bitrate via the slider:</p>
                <input type="range" min="64" max="320" step="64" onChange={onMp3BitrateChange} value={bitrate} className="slider"/>
                <span id="bitrateText"></span><br/><br/>
                <i>A higher bitrate allows for potentially higher audio quality, at the expense of a larger file size.</i>
            </div>
        )
    }
}

export default BitrateSlider;
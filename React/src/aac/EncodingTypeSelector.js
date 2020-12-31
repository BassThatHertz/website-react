import React from 'react';
import BitrateSlider from './BitrateSlider'
import VbrDropdown from './VbrDropdown'

class AacEncodingTypeSelector extends React.Component {
    renderComponent = () => {
        switch (this.props.encodingType) {
          case 'cbr':
            return <BitrateSlider 
                    sliderMoved={this.props.onSliderMoved}
                    bitrate={this.props.sliderValue} />;
          case 'vbr':
            return <VbrDropdown o
                    onVbrModeChange={this.props.onVbrModeChange}
                    vbrMode={this.props.vbrMode} />;
          default:
            return null;
        }
    };

    render () {
        return (
            <div id="FDK">
                <label htmlFor="fdk_encoding">CBR or VBR:</label>
                <select id="fdk_encoding" onChange={this.props.onAacEncodingTypeChange}>
                    <option disabled value>Select Encoding Type</option>
                    <option value="cbr">CBR (Constant Bitrate)</option>
                    <option value="vbr">VBR (Variable Bitrate)</option>
                </select>
                {this.renderComponent()}
            </div>
        )
    }
}

export default AacEncodingTypeSelector;
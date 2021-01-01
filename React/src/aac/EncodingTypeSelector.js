import React from 'react';
import BitrateSlider from './BitrateSlider'
import VbrDropdown from './VbrDropdown'

function AacEncodingTypeSelector(props) {
    
    function renderComponent() {
        switch (props.encodingType) {
          case 'cbr':
            return <BitrateSlider 
                    sliderMoved={props.onSliderMoved}
                    bitrate={props.sliderValue} />;
          case 'vbr':
            return <VbrDropdown o
                    onVbrModeChange={props.onVbrModeChange}
                    vbrMode={props.vbrMode} />;
          default:
            return null;
        }
    };

    return (
        <div id="FDK">
            <label htmlFor="fdk_encoding">CBR or VBR:</label>
            <select id="fdk_encoding" onChange={props.onAacEncodingTypeChange}>
                <option disabled value>Select Encoding Type</option>
                <option value="cbr">CBR (Constant Bitrate)</option>
                <option value="vbr">VBR (Variable Bitrate)</option>
            </select>
            {renderComponent()}
        </div>
    )
}

export default AacEncodingTypeSelector;
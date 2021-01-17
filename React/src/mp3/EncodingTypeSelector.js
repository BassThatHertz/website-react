import React from 'react';
import BitrateSlider from './BitrateSlider';
import VbrDropdown from './VbrDropdown';

function Mp3EncodingTypeSelector(props) {

  function renderComponent() {
    switch (props.mp3EncodingType) {
      // Show the BitrateSlider component if CBR or ABR is selected. Show the VbrDropdown component if VBR is selected.
      case 'cbr':
        return <BitrateSlider 
                onMp3BitrateChange={props.onMp3BitrateChange}
                bitrate={props.bitrate} />;
      case 'abr':
        return <BitrateSlider 
                onMp3BitrateChange={props.onMp3BitrateChange}
                bitrate={props.bitrate} />;
      case 'vbr':
        return <VbrDropdown
                onVbrSettingChange={props.onVbrSettingChange}
                vbrSetting={props.vbrSetting} />;
      default:
        return null;
    }
  };

  return (
    <div id="mp3_encoding_div">
      <label htmlFor="mp3_encoding_type">Encoding Type:</label>
      <select value={props.mp3EncodingType} id="mp3_encoding_type" onChange={props.onMp3EncodingTypeChange}>
        <option disabled value>
          Select encoding type
        </option>
        <option value="cbr">CBR (Constant Bitrate)</option>
        <option value="abr">ABR (Average Bitrate)</option>
        <option value="vbr">VBR (Variable Bitrate)</option>
      </select>
      {renderComponent()}
    </div>
  );
}

export default Mp3EncodingTypeSelector;
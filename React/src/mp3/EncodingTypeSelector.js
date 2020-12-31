import React from 'react';
import BitrateSlider from './BitrateSlider';
import VbrDropdown from './VbrDropdown';

class Mp3EncodingTypeSelector extends React.Component {
  renderComponent = () => {
    const encodingType = this.props.mp3EncodingType
    const mp3VbrSetting = this.props.onVbrSettingChange
    // When the slider is used.
    const onMp3BitrateChange = this.props.onMp3BitrateChange
    // Slider value.
    const bitrate = this.props.bitrate

    switch (encodingType) {
      // Show the Mp3Cbr component if CBR or ABR is selected. Show the Mp3Vbr component if VBR is selected.
      case 'cbr':
        return <BitrateSlider 
                onMp3BitrateChange={onMp3BitrateChange}
                bitrate={bitrate} />;
      case 'abr':
        return <BitrateSlider 
                onMp3BitrateChange={onMp3BitrateChange}
                bitrate={bitrate} />;
      case 'vbr':
        return <VbrDropdown onVbrSettingChange={mp3VbrSetting} />;
      default:
        return null;
    }
  };

  render() {
    const onMp3EncodingTypeChange = this.props.onMp3EncodingTypeChange;
    return (
      <div id="mp3_encoding_div">
        <label htmlFor="mp3_encoding_type">Encoding Type:</label>
        <select id="mp3_encoding_type" onChange={onMp3EncodingTypeChange}>
          <option disabled value>
            Select encoding type
          </option>
          <option value="cbr">CBR (Constant Bitrate)</option>
          <option value="abr">ABR (Average Bitrate)</option>
          <option value="vbr">VBR (Variable Bitrate)</option>
        </select>
        {this.renderComponent()}
      </div>
    );
  }
}

export default Mp3EncodingTypeSelector;
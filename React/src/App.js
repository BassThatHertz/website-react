import React from 'react';
import Mp3EncodingTypeSelector from './mp3/EncodingTypeSelector';
import AacEncodingTypeSelector from './aac/EncodingTypeSelector';
import SubmitButton from './SubmitButton';

class App extends React.Component {
  state = { codec: 'MP3',
            mp3EncodingType: 'cbr',
            mp3Bitrate: '192',
            mp3VbrSetting: '0',
            // AAC
            aacEncodingMode: 'cbr',
            aacSlider: '256',
            aacVbrMode: '5'
          };

  onCodecChange = (e) => {
    this.setState({ codec: e.target.value });
  };

  // MP3

  onMp3EncodingTypeChange = (event) => {
    this.setState({ mp3EncodingType: event.target.value });
    this.setState({ mp3Bitrate: '192' });
    this.setState({ mp3VbrSetting: '0' });
    console.log(`mp3EncodingType changed to: ${event.target.value}`)
  };
  // When the CBR/ABR slider is moved.
  onMp3BitrateChange = (event) => {
    this.setState({ mp3Bitrate: event.target.value });
    document.getElementById('bitrateText').innerHTML = `${event.target.value} kbps`
    console.log(`mp3Bitrate changed to: ${event.target.value}`)
  }

  onMp3VbrSettingChange = (event) => {
    this.setState({ mp3VbrSetting: event.target.value })
    console.log(`mp3VbrSetting changed to: ${event.target.value}`)
  }

  // AAC

  onAacEncodingTypeChange = (e) => {
    this.setState({ aacEncodingMode: e.target.value});
    this.setState({ aacSlider: '256' });
    //this.setState({ aacVbrMode: '5'})
    console.log('AAC encoding mode:', e.target.value);
  }
  onAacSliderMoved = (e) => {
    this.setState({ aacSlider: e.target.value });
    document.getElementById('fdkvalue').innerHTML = `${e.target.value} kbps`
    console.log('AAC slider:', e.target.value);
  }
  onAacVbrModeChange = (e) => {
    this.setState({ aacVbrMode: e.target.value} );
    console.log('AAC VBR:', e.target.value);
  }

  submitClicked = () => {
    console.log(this.state)
    fetch("/", {
      method: 'POST',
      body: JSON.stringify(this.state)
    });
  };

  renderComponent = () => {
    const codec = this.state.codec
    switch (codec) {
      case 'MP3':
        return (
          <Mp3EncodingTypeSelector
            mp3EncodingType={this.state.mp3EncodingType}
            onMp3EncodingTypeChange={this.onMp3EncodingTypeChange}
            bitrate={this.state.mp3Bitrate}
            onMp3BitrateChange={this.onMp3BitrateChange}
            onMp3VbrSettingChange={this.onMp3VbrSettingChange} />
        );
      case 'AAC':
          return (
            <AacEncodingTypeSelector
              onAacEncodingTypeChange={this.onAacEncodingTypeChange}
              encodingType={this.state.aacEncodingMode}
              onSliderMoved={this.onAacSliderMoved}
              sliderValue={this.state.aacSlider}
              onVbrModeChange={this.onAacVbrModeChange} 
              vbrMode={this.state.aacVbrMode} />
          )
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        <h5>Select a file, or drag and drop a file onto this webpage.</h5>
        <hr></hr><h5>Desired Format</h5>
        <select
          id="codecs"
          onChange={this.onCodecChange}
          value={this.state.codec}>
          <option value="AAC">AAC (.m4a)</option>
          <option value="AC3">AC3 (Dolby Digital)</option>
          <option value="ALAC">ALAC</option>
          <option value="CAF">CAF (.caf)</option>
          <option value="DTS">DTS</option>
          <option value="FLAC">FLAC</option>
          <option value="MKA">MKA (extract audio without encoding it)</option>
          <option value="MKV">MKV (.mkv)</option>
          <option value="MP3">MP3</option>
          <option value="MP4">MP4 (.mp4)</option>
          <option value="Opus">Opus (.opus)</option>
          <option value="Vorbis">Vorbis (.ogg)</option>
          <option value="WAV">WAV</option>
        </select><br></br><br></br>
        <hr></hr><h5>Encoder Settings</h5>
        {this.renderComponent()}<br></br>
        <SubmitButton onSubmit={this.submitClicked} />
      </div>
    );
  }
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TopBar from './TopBar'; 
import FileInput from './FileInput';
import Mp3EncodingTypeSelector from './mp3/EncodingTypeSelector';
import AacEncodingTypeSelector from './aac/EncodingTypeSelector';
import WavBitDepth from './WAV';
import SubmitButton from './SubmitButton';

class App extends React.Component {
  state = { 
            file: null,  
            codec: 'MP3',
            mp3EncodingType: 'cbr',
            mp3Bitrate: '192',
            mp3VbrSetting: '0',
            // AAC
            aacEncodingMode: 'cbr',
            aacSlider: '256',
            aacVbrMode: '5',
            // WAV
            wavBitDepth: '24'
          };
  
  onFileInput = (e) => {
    const filename = e.target.files[0].name;
    const filetype = e.target.files[0].type;
    console.log(filename, filetype, e.target.files[0])

    this.setState({ file: e.target.files[0] })
    console.log(this.state.file)

    const inputLabel = document.getElementById("file_input_label");
    inputLabel.innerText = e.target.files[0].name; // Show the name of the selected file.
    
    const outputNameBox = document.getElementById("output_name");
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.')
    // Remove percentage sign(s) as this causes an issue when secure_filename is used in main.py
    const defaultOutputName = nameWithoutExt.replace(/%/g, ''); 
    outputNameBox.value = defaultOutputName;
  }

  onCodecChange = (e) => {
    this.setState({ codec: e.target.value });
  };

  // MP3

  onMp3EncodingTypeChange = (e) => {
    this.setState({ mp3EncodingType: e.target.value});
  };
  onMp3BitrateChange = (e) => {
    this.setState({ mp3Bitrate: e.target.value });
    document.getElementById('bitrateText').innerHTML = `${e.target.value} kbps`
  }
  onMp3VbrSettingChange = (e) => {
    this.setState({ mp3VbrSetting: e.target.value })

  }

  // AAC

  onAacEncodingTypeChange = (e) => {
    this.setState({ aacEncodingMode: e.target.value});
  }

  onAacSliderMoved = (e) => {
    this.setState({ aacSlider: e.target.value });
    document.getElementById('fdkvalue').innerHTML = `${e.target.value} kbps`
  }
  onAacVbrModeChange = (e) => {
    this.setState({ aacVbrMode: e.target.value} );
  }

  onWavBitDepthChange = (e) => {
    this.setState({ wavBitDepth: e.target.value })
    console.log(e.target.value)
  }

  submitClicked = async() => {
    console.log(this.state)
    const data = new FormData();
    data.append('file', this.state.file)
  
    // const response = await fetch("/", {
    //   method: 'POST',
    //   body: data
    // });
    // const jsonResponse = await response.json()
    // console.log(jsonResponse)
    // const downloadLink = jsonResponse.download_path;
    // console.log(downloadLink)
    // const anchorTag = document.createElement("a");
    // anchorTag.href = downloadLink;
    // anchorTag.download = '';
    // anchorTag.click();
  };

  renderComponent = () => {
    const codec = this.state.codec
    switch (codec) {
      case 'MP3':
        return (
          <Mp3EncodingTypeSelector
            mp3EncodingType={this.state.mp3EncodingType}
            bitrate={this.state.mp3Bitrate}
            // Passing the functions as props.
            onMp3EncodingTypeChange={this.onMp3EncodingTypeChange}
            onMp3BitrateChange={this.onMp3BitrateChange}
            onMp3VbrSettingChange={this.onMp3VbrSettingChange}
            vbrSetting={this.state.mp3VbrSetting} />
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
      case 'WAV':
        return (
          <WavBitDepth
          onWavBitDepthChange={this.onWavBitDepthChange}
          bitDepth={this.state.wavBitDepth}/>
        )
      default:
        return null;
    }
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/'>
            <TopBar/>
            <div>
              <h1>Audio / Video Converter</h1>
              <p id="tagline">An easy to use, ad-free website to meet some of your audio/video needs :)</p>
              <h5>Select a file, or drag and drop a file onto this webpage.</h5>
              <FileInput
              updateBoxes={this.onFileInput} />
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
              <hr/><h5>Encoder Settings</h5>
              {this.renderComponent()}<br/>
              <hr/><h5>Output Filename</h5>
              <input type="text" autoComplete="off" className="form-control" maxLength="200" id="output_name" required/><br/>
              <SubmitButton onSubmit={this.submitClicked} />
            </div>
          </Route>
          <Route path='/test'>
            <SubmitButton/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
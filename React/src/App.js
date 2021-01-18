import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TopBar from './TopBar'; 
import FileInput from './FileInput';
import AacEncodingTypeSelector from './AAC/EncodingTypeSelector';
import AC3 from './AC3';
import DTS from './DTS';
import FLAC from './FLAC';
import IsKeepVideo from './IsKeepVideo';
import MKVMP4 from './MKVMP4';
import Mp3EncodingTypeSelector from './MP3/EncodingTypeSelector';
import NoOptions from './NoOptions';
import Opus from './Opus';
import VorbisEncodingType from './Vorbis/VorbisEncodingType';
import WavBitDepth from './WAV';
import SubmitButton from './SubmitButton';

import start from './Functions/Start';


class App extends React.Component {
  state = { 
            file: null,  
            codec: 'MP3',
            sliderValue: '192',
            // MP3
            mp3EncodingType: 'cbr',
            mp3VbrSetting: '0',
            // AAC
            aacEncodingMode: 'cbr',
            aacVbrMode: '5',
            // AC3
            ac3Bitrate: '640',
            // DTS
            dtsBitrate: '768',
            // FLAC
            flacCompression: '5',
            // Keep the video?
            isKeepVideo: 'no',
            // MKV and MP4
            videoSetting: 'veryfast', // x264 preset
            crfValue: '18',
            // Opus
            opusType: 'vbr',
            // Vorbis
            vorbisEncodingType: 'abr',
            qValue: '6',
            // WAV
            wavBitDepth: '16'
          }
  
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

  onBitrateSliderMoved = (e) => {
    this.setState({ sliderValue: e.target.value })
    console.log(e.target.value)
  }

  // MP3
  onMp3EncodingTypeChange = (e) => {
    this.setState({ mp3EncodingType: e.target.value});
  };
  onMp3BitrateChange = (e) => {
    this.setState({ mp3Bitrate: e.target.value });
    document.getElementById('bitrateText').innerHTML = ` ${e.target.value} kbps`
  }
  onMp3VbrSettingChange = (e) => {
    this.setState({ mp3VbrSetting: e.target.value })

  }

  // AAC
  onAacEncodingTypeChange = (e) => {
    this.setState({ aacEncodingMode: e.target.value});
  }
  onAacVbrModeChange = (e) => {
    this.setState({ aacVbrMode: e.target.value} );
  }

  // AC3
  onAc3BitrateChange = (e) => {
    this.setState({ ac3Bitrate: e.target.value })
  }

  // DTS
  onDtsBitrateChange = (e) => {
    this.setState({ dtsBitrate: e.target.value })
    console.log(e.target.value)
  }

  // FLAC
  onFlacCompressionChange = (e) => {
    this.setState({ flacCompression: e.target.value })
  }

  // isKeepVideo
  onIsKeepVideoChange = (e) => {
    this.setState({ isKeepVideo: e.target.value })
    console.log(e.target.value)
  }

  // MKV and MP4
  onVideoSettingChange = (e) => {
    this.setState({ videoSetting: e.target.value })
  }
  onCrfChange = (e) => {
    this.setState({ crfValue: e.target.value })
  }

  // Opus
  onOpusTypeChange = (e) => {
    this.setState({ opusType: e.target.value })
    console.log(e.target.value)
  }

  // Vorbis
  onVorbisEncodingTypeChange = (e) => {
    this.setState({ vorbisEncodingType: e.target.value })
  }
  onVorbisSliderMoved = (e) => {
    
    this.setState({ qValue: e.target.value })
  }

  // WAV
  onWavBitDepthChange = (e) => {
    this.setState({ wavBitDepth: e.target.value })
    console.log(e.target.value)
  }

  onSubmitClicked = async() => {
    console.log(this.state)
    start(this.state)
    // upload_and_send_conversion_request()
    // console.log(this.state)
    // const data = new FormData();
    // data.append('file', this.state.file)
    // const response = await fetch("/", {
    //   method: 'POST',
    //   body: data
    // });
    // const textResponse = await response.text()
    // console.log(textResponse)
  }


  renderComponent = () => {
    const codec = this.state.codec
    switch (codec) {
      case 'MP3':
        return (
          <div>
            <Mp3EncodingTypeSelector
              mp3EncodingType={this.state.mp3EncodingType}
              sliderValue={this.state.sliderValue}
              // Passing the functions as props.
              onMp3EncodingTypeChange={this.onMp3EncodingTypeChange}
              onBitrateSliderMoved={this.onBitrateSliderMoved}
              onMp3VbrSettingChange={this.onMp3VbrSettingChange}
              vbrSetting={this.state.mp3VbrSetting} />
            <IsKeepVideo
              onIsKeepVideoChange={this.onIsKeepVideoChange}
              isKeepVideo={this.state.isKeepVideo} />
          </div>
            
        );
      case 'AAC':
          return (
            <AacEncodingTypeSelector
              onAacEncodingTypeChange={this.onAacEncodingTypeChange}
              encodingType={this.state.aacEncodingMode}
              onBitrateSliderMoved={this.onBitrateSliderMoved}
              sliderValue={this.state.sliderValue}
              onVbrModeChange={this.onAacVbrModeChange} 
              vbrMode={this.state.aacVbrMode} />
          )
      case 'AC3':
        return (
          <AC3
            onAc3BitrateChange={this.onAc3BitrateChange}
            ac3Bitrate={this.state.ac3Bitrate} />
        )
      case 'ALAC':
        return (
          <NoOptions/>
        )
      case 'CAF':
        return (
          <NoOptions/>
        )
      case 'DTS':
        return (
          <DTS 
            onDtsBitrateChange={this.onDtsBitrateChange}
            dtsBitrate={this.state.dtsBitrate} />
        )
      case 'FLAC':
        return (
          <FLAC
            onFlacCompressionChange={this.onFlacCompressionChange}
            flacCompression={this.state.flacCompression} />
        )
      case 'MKA':
        return (
          <NoOptions/>
        )
      case 'MKV':
        return (
          <MKVMP4
            onVideoSettingChange={this.onVideoSettingChange}
            videoSetting={this.state.videoSetting}
            onCrfChange={this.onCrfChange}
            crfValue = {this.state.crfValue} />
        )
      case 'MP4':
        return (
          <MKVMP4
            onVideoSettingChange={this.onVideoSettingChange}
            videoSetting={this.state.videoSetting}
            onCrfChange={this.onCrfChange}
            crfValue = {this.state.crfValue} />
        )

      case 'Opus':
        return (
          <Opus
            onOpusTypeChange={this.onOpusTypeChange}
            opusType={this.state.opusType}
            onBitrateSliderMoved={this.onBitrateSliderMoved}
            sliderValue={this.state.sliderValue} />
        )

      case 'Vorbis':
        return (
          <VorbisEncodingType
            onVorbisEncodingTypeChange={this.onVorbisEncodingTypeChange}
            vorbisEncodingType={this.state.vorbisEncodingType}
            onSliderMoved={this.onVorbisSliderMoved}
            qValue={this.state.qValue}
            onBitrateSliderMoved={this.onBitrateSliderMoved}
            sliderValue={this.state.sliderValue} />

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
              <div id="alert_wrapper" style={{display: 'none'}}/>
              <SubmitButton 
                onSubmitClicked={this.onSubmitClicked} />
              <button className="btn btn-primary d-none" id="uploading_btn" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                Uploading file for conversion...
              </button>
              <>
              {/*"Cancel upload" button (Bootstrap class)*/}
              <button type="button" id="cancel_btn" className="btn btn-secondary d-none">Cancel upload</button>
              </>
              <>
              {/*"Converting..." button (Bootstrap class)*/}
              <div className="text-center" id="converting_btn" style={{display: 'none'}}>
                <button className="btn btn-info" disabled>
                  <span className="spinner-border spinner-border-sm" />
                  Converting...</button>
              </div>
              {/*Upload progress bar*/}
              <div id="progress_wrapper" style={{display: 'none'}}>
                <br />
                <div className="progress mb-3"> {/*Bootstrap class*/}
                  <div id="progress_bar" className="progress-bar" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} />
                </div>
                <p id="progress_status" />
              </div>
              </>
              <>
              {/*ENCODER PROGRESS*/}
              <p id="progress" style={{display: 'none'}} />
              </>
            </div>
          </Route>
          <Route path='/test'>
            
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
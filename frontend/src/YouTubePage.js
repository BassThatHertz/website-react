function YoutubePage() {
    return (
        <>
            <h1>YT downloader</h1>
            <div className="container">
                <p><strong>Video (best quality)</strong> - usually gives you an MKV (.mkv) or WebM (.webm) file with Opus audio.</p>
                <p><strong>Audio (best quality)</strong> - usually gives you an Opus file (.opus).</p>
                <p>If using an <strong>iOS device</strong>, select <strong>Video (MP4)</strong> or <strong>Audio (MP3)</strong> as iOS does not support all media formats natively.</p>
                <h5><b>Link:</b></h5>
                <input type="text" autoComplete="off" className="form-control" maxLength={200} name="link" id="link" required />
                <hr /> 
                <div id="table_div" style={{display: 'none'}}>
                <table id="table" />
                </div>
                <div id="alert_wrapper" style={{display: 'none'}} />
                {/*MP3 DIV*/}
                <div id="mp3_div" style={{display: 'none'}}>
                {/*Bitrate modes for MP3*/}
                <div id="mp3_encoding_div">
                    <label htmlFor="mp3_encoding_type">Bitrate Type:</label>
                    <select id="mp3_encoding_type" onchange="showHideMP3(this.value);">
                    <option disabled value>Select encoding type</option>
                    <option selected value="cbr">CBR (Constant Bitrate)</option>
                    <option value="vbr">VBR (Variable Bitrate)</option>
                    </select>
                </div>
                {/*Bitrate slider for MP3 CBR*/}
                <div id="mp3_slider_div">
                    <p>Set your desired bitrate via the slider:</p>
                    <input type="range" min={64} max={320} step={64} defaultValue={192} id="mp3_bitrate" className="slider" />
                    <span id="bitrate_value" /><br /><br />
                </div>
                {/* VBR settings for MP3 */}
                <div id="mp3_vbr_setting_div" style={{display: 'none'}}>
                    <label htmlFor="mp3_vbr_setting">Setting:</label>
                    <select id="mp3_vbr_setting">
                    <option disabled value>Select VBR setting</option>
                    <option selected value={0}>-V 0 (~240kbps)</option>
                    <option value={1}>-V 1 (~220kbps)</option>
                    <option value={2}>-V 2 (~190kbps)</option>
                    <option value={3}>-V 3 (~170kbps)</option>
                    <option value={4}>-V 4 (~160kbps)</option>
                    <option value={5}>-V 5 (~130kbps)</option>
                    <option value={6}>-V 6 (~120kbps)</option>
                    </select><br />
                    <i>For more details about the settings, click
                    <a target="_blank" href="http://wiki.hydrogenaud.io/index.php?title=LAME#Recommended_settings_details">here</a>.
                    </i>
                </div>
                <div className="btn-group">
                    <button className="btn btn-dark" value="download_mp3" onClick="buttonClicked(this.value)" id="download_mp3">Download</button>
                </div>
                </div> {/*Closing tag for MP3 div*/}
                <div id="bring_back_other_buttons" style={{display: 'none'}}>
                <hr />
                <div className="btn-group">
                    <button className="btn btn-dark" onClick="showInitialButtons()">Bring back the other buttons!</button>
                </div>
                </div> 
                <div className="btn-group">
                <button className="btn btn-dark" id="mp4" onClick={this.buttonClicked} value="Video [MP4]">Video (MP4)</button>
                </div>
                <div className="btn-group">
                <button className="btn btn-dark" id="video_best" onClick="buttonClicked(this.value)" value="Video [best]">Video (best quality)</button>
                </div><br /><br />
                <div className="btn-group">
                <button className="btn btn-dark" id="audio_mp3" onClick="showMP3Div()" value="audio_mp3">Audio (MP3)</button>
                </div>
                <div className="btn-group">
                <button className="btn btn-dark" id="audio" onClick="buttonClicked(this.value)" value="Audio [best]">Audio (best quality)</button>
                </div><br /><br />
                <div className="btn-group">
                <button className="btn btn-dark" id="other" onClick="buttonClicked(this.value)" value="other">Other</button>
                </div>
            </div>
        </>
    )
}

export default YoutubePage;
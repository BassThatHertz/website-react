import showConversionProgress from './ShowConversionProgress'
import showAlert from './ShowAlert';
import reset from './Reset'

async function sendConversionRequest(inputFilename, progressFilename, state) { 
    console.log(`state: ${state}`)
    // const chosenCodec = document.getElementById('codecs').value;
    // const videoMode = document.getElementById('video_mode').value;
    // const opusVorbisSlider = document.getElementById("opus_vorbis_slider").value;
    // const outputName = document.getElementById("output_name").value;
    // const mp3EncodingType = document.getElementById('mp3_encoding_type').value;
    // const mp3Bitrate = document.getElementById('mp3_bitrate').value;
    // const vbrSettingMP3 = document.getElementById('mp3_vbr_setting').value;
    // const ac3Bitrate = document.getElementById('ac3_bitrate').value;
    // const vorbisQuality = document.getElementById('vorbis_quality').value
    // const vorbisEncoding = document.getElementById('vorbis_encoding').value;
    // const flacCompression = document.getElementById('flac_compression').value;
    // const fdkType = document.getElementById('fdk_encoding').value;
    // const fdkCBR = document.getElementById('fdk_slider').value;
    // const fdkVBR = document.getElementById('fdk_vbr_value').value;
    // const isFDKLowpass = document.querySelector('input[name="is_lowpass"]:checked').value;
    // const FDKLowpass = document.getElementById('fdk_lowpass').value;
    // const dtsBitrate = document.getElementById('dts_slider').value;
    // const opusBitrate = document.getElementById('opus_cbr_bitrate').value;
    // const opusEncodingType = document.getElementById('opus_encoding_type').value;
    // const isKeepVideo = document.querySelector('input[name="is_keep_video"]:checked').value;
    // const crfValue = document.getElementById('crf_slider').value;
    // const wavBitDepth = document.getElementById('wav_bit_depth').value;

    // const data = new FormData();

    // data.append("request_type", "convert");
    // data.append("filename", inputFilename);
    // data.append("chosen_codec", chosenCodec);
    // data.append("video_mode", videoMode);
    // data.append("opus_vorbis_slider", opusVorbisSlider);
    // data.append("output_name", outputName);
    // data.append("mp3_encoding_type", mp3EncodingType);
    // data.append("mp3_bitrate", mp3Bitrate);
    // data.append("mp3_vbr_setting", vbrSettingMP3);
    // data.append("ac3_bitrate", ac3Bitrate);
    // data.append("vorbis_quality", vorbisQuality);
    // data.append("vorbis_encoding", vorbisEncoding);
    // data.append("flac_compression", flacCompression);
    // data.append("fdk_type", fdkType);
    // data.append("fdk_cbr", fdkCBR);
    // data.append("fdk_vbr", fdkVBR);
    // data.append("is_fdk_lowpass", isFDKLowpass);
    // data.append("fdk_lowpass", FDKLowpass);
    // data.append("dts_bitrate", dtsBitrate);
    // data.append("opus_cbr_bitrate", opusBitrate);
    // data.append("opus_encoding_type", opusEncodingType);
    // data.append("is_keep_video", isKeepVideo);
    // data.append("crf_value", crfValue);
    // data.append("wav_bit_depth", wavBitDepth);
    
    const data = new FormData()
    data.append('request_type', 'convert')
    data.append('filename', inputFilename);
    data.append('output_name', document.getElementById('output_name').value)
    data.append('states', JSON.stringify(state))

    let shouldLog = true;
    showConversionProgress(shouldLog, progressFilename);

    const conversionResponse = await fetch("/", {
        method: 'POST',
        body: data
    });

    shouldLog = false;
    reset();
    console.log(conversionResponse.status)
    if (conversionResponse.status === 500) {
        console.log('test')
        const error = await conversionResponse.text()
        showAlert(error, 'danger');
        console.log(error);
    }
    else if (!conversionResponse.ok) {
        showAlert('An error occurred when trying to convert the file.', 'danger');
    }
    else {
        const jsonResponse = await conversionResponse.json();
        const downloadLink = jsonResponse.download_path;
        console.log(downloadLink)
        const logFile = jsonResponse.log_file;

        const anchorTag = document.createElement("a");
        anchorTag.href = jsonResponse.download_path;
        anchorTag.download = '';
        anchorTag.click();
    }
}

export default sendConversionRequest;
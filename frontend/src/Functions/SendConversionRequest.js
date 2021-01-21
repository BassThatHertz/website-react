import showAlert from './ShowAlert';
import reset from './Reset'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let shouldLog = false
let loopCount = 0

async function showConversionProgress(progressFilename) {
    while (shouldLog) {
        loopCount += 1
        console.log(`loopCount: ${loopCount}`)
        await sleep(500)
        const conversionProgressResponse = await fetch(`ffmpeg-progress/${progressFilename}`);
        const textInFile = await conversionProgressResponse.text();
        if (conversionProgressResponse.ok && textInFile) {
            const lines = textInFile.split('\n');
            const fifthLastLine = lines[lines.length - 6].split('=');
            const justProgressTime = fifthLastLine.slice(-1)[0];
            const withoutMicroseconds = justProgressTime.slice(0, -7);
            const milliseconds = justProgressTime.substring(9, 12);

            showAlert(`${withoutMicroseconds} [HH:MM:SS] of the file has been converted so far...<br>\
            (and ${milliseconds} milliseconds)`, 'primary');
            console.log(`${withoutMicroseconds} [HH:MM:SS]`);
    
        }
    }
}

async function sendConversionRequest(inputFilename, progressFilename, state) { 
    const data = new FormData()
    data.append('request_type', 'convert')
    data.append('filename', inputFilename);
    data.append('output_name', document.getElementById('output_name').value)
    data.append('states', JSON.stringify(state))

    shouldLog = true

    // Run the showConversionProgress function in ShowConversionProgres.js
    showConversionProgress(progressFilename);

    const conversionResponse = await fetch("/conversions", {
        method: 'POST',
        body: data
    });

    shouldLog = false

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

        const anchorTag = document.createElement("a");
        anchorTag.href = jsonResponse.download_path;
        anchorTag.download = '';
        anchorTag.click();
    }
}

export default sendConversionRequest;
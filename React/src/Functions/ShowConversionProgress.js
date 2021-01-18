import showAlert from './ShowAlert';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showConversionProgress(shouldLog, progressFilename) {
    while (shouldLog) {
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
            await sleep(1000);
        }
        else {
            console.log('in else')
            break;
        }
    }
    // show_alert(`File converted. If you'd like to view the FFmpeg output, click \
    //     <a href="${logFile}" target="_blank">here</a>.`, "success");
}

export default showConversionProgress;
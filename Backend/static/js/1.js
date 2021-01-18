import sendConversionRequest from './Functions/SendConversionRequest';

const input = document.getElementById("file_input");
const urlInput = document.getElementById("url");
const inputLabel = document.getElementById("file_input_label");
const outputNameBox = document.getElementById("output_name");
const conversionProgress = document.getElementById("progress");
const progressWrapper = document.getElementById("progress_wrapper");
const progressStatus = document.getElementById("progress_status");
const convertButton = document.getElementById("convert_btn");
const uploadingButton = document.getElementById("uploading_btn");
const cancelButton = document.getElementById("cancel_btn");
const alertWrapper = document.getElementById("alert_wrapper");
const progressBar = document.getElementById('progress_bar');
const progressParagraph = document.getElementById('progress');

export function show_alert(message, type) {
    alertWrapper.style.display = 'block';
    alertWrapper.innerHTML =
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <span>${message}</span>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
}

export function upload_and_send_conversion_request() {
    // Show an alert if a file hasn't been selected or the URL input box is empty.
    if (!input.value && !document.getElementById("output_name").value && !urlInput.value) {
        show_alert("It helps if you select the file that you want to convert.", "warning");
        return;
    }
    // If the URL input box is not empty.
    else if (urlInput.value) {
        convertButton.classList.add("d-none");

        const urlConvertRequest = new XMLHttpRequest();
        urlConvertRequest.addEventListener("load", () => getProgressFilename(urlConvertRequest, urlInput.value));
        urlConvertRequest.addEventListener("error", showError);

        const data = new FormData();
        data.append("request_type", "convert_url");

        urlConvertRequest.open("POST", "/");
        urlConvertRequest.send(data);
    }

    // If a file has been selected.
    else if (input.value) {
        const chosenFile = input.files[0];
        const filename = chosenFile.name;
        const filenameParts = filename.split('.');
        const fileExt = filenameParts[filenameParts.length - 1];
        const filesizeMB = ((chosenFile.size / 1000000).toFixed(2)).toString();
        const filesize = chosenFile.size;

        const progressFilenameRequest = new XMLHttpRequest();
        progressFilenameRequest.upload.addEventListener("progress", showProgress);
        progressFilenameRequest.addEventListener("load", () => getProgressFilename(progressFilenameRequest, filename));
        progressFilenameRequest.addEventListener("error", () => showError(progressFilenameRequest));
        cancelButton.addEventListener("click", () => abortUpload(progressFilenameRequest));

        const allowedFiletypes = ["mp3", "aac", "wav", "ogg", "opus", "m4a", "flac", "mka", "wma", "mkv", "mp4", "flv", "wmv",
            "avi", "ac3", "3gp", "MTS", "webm", "adpcm", "dts", "spx", "caf", "mov", "thd", "dtshd", "aif", "aiff", "vob"]

        // Show an alert if an incompatible filetype has been selected.
        if (!allowedFiletypes.includes(fileExt)) {
            show_alert('Incompatible filetype selected. Click <a href="/filetypes" \
            target="_blank">here</a> to see the list of compatible filetypes.', "danger");
            reset();
            return;
        }
        // Show an alert if the filesize exceeds the maximum size allowed.
        else if (filesize > 3 * 10**9) {
            show_alert("Max file size: 3 GB", "danger")
            reset();
            return;
        }
        // Show an alert if a disallowed character has been entered in the output name box.
        else if (outputNameBox.value.includes('"') || outputNameBox.value.includes('/') ||
            outputNameBox.value.includes('\\') || outputNameBox.value.includes('?') || outputNameBox.value.includes('*') ||
            outputNameBox.value.includes('>') || outputNameBox.value.includes('<') || outputNameBox.value.includes('|') ||
            outputNameBox.value.includes(':') || outputNameBox.value.includes(';') || outputNameBox.value.includes('&&') ||
            outputNameBox.value.includes('command') || outputNameBox.value.includes('$') ||
            outputNameBox.value.includes('.')) {
            show_alert('Characters not allowed: ., ", /, ?, *, >, <, |, :, $ or the word "command"', "danger");
            return;
        }
        // Show an alert if output name box is empty.
        else if (document.getElementById("output_name").value == '') {
            show_alert("You must enter your desired filename.", "danger");
            return;
        }

        alertWrapper.style.display = 'none';
        input.disabled = true;
        outputNameBox.disabled = true;
        convertButton.classList.add("d-none");
        uploadingButton.classList.remove("d-none");
        cancelButton.classList.remove("d-none");
        progressWrapper.classList.remove("d-none");
        progressWrapper.style.display = 'block';

        const data = new FormData();
        data.append("request_type", "uploaded");
        data.append("chosen_file", chosenFile);
        data.append("filesize", filesizeMB);
    
        progressFilenameRequest.open("POST", "/");
        progressFilenameRequest.send(data);
    }
    else {
        show_alert("No file selected.", "danger");
        return;
    }
}

export function getProgressFilename(request, data) {
    uploadingButton.classList.add('d-none');
    cancelButton.classList.add('d-none');
    progressWrapper.classList.add("d-none");
    if (request.status == 200) {
        const progressFilename = request.responseText;
        document.getElementById("converting_btn").style.display = 'block';
        progressParagraph.style.display = 'block';
        sendConversionRequest(data);
    }
    else {
        show_alert(request.responseText, "danger");
    }
}

export function showError(progressFilenameRequest) {
    show_alert(`${progressFilenameRequest.responseText}`, "danger");
    console.log(`progressFilenameRequest error: ${progressFilenameRequest.responseText}`);
    reset();
}

export function showProgress(event) {
    const loaded = event.loaded / 10 ** 6;
    const total = event.total / 10 ** 6;
    const percentageComplete = Math.floor((loaded / total) * 100);

    if (percentageComplete > previousPercentageComplete && percentageComplete !== 100) {
        const uploadProgressRequest = new XMLHttpRequest();
        const uploadProgress = new FormData();
        uploadProgress.append('upload_progress', percentageComplete);
        uploadProgressRequest.open("POST", "/");
        uploadProgressRequest.send(uploadProgress);
    }

    progressBar.html(`${Math.floor(percentageComplete)}%`);
    // Add a style attribute to the progress div, i.e. style="width: x%"
    progressBar.setAttribute("style", `width: ${percentageComplete}%`);

    // MB loaded in this interval is (loaded - previousLoaded) and
    // ((Date.now() / 1000) - previousTime) will give us the time since the last time interval.
    const speed = ((loaded - previousLoaded) / ((Date.now() / 1000) - previousTime));

    const completionTimeSeconds = (total - loaded) / speed;
    const hours = (Math.floor(completionTimeSeconds / 3600) % 60).toString().padStart(2, '0');
    const minutes = (Math.floor(completionTimeSeconds / 60) % 60).toString().padStart(2, '0');
    const seconds = (Math.ceil(completionTimeSeconds % 60)).toString().padStart(2, '0');
    const completionTime = `${hours}:${minutes}:${seconds}`;

    progressStatus.innerText = `${loaded.toFixed(1)} MB of ${total.toFixed(1)} MB uploaded
    Upload Speed: ${(speed * 8).toFixed(1)} Mbps (${(speed).toFixed(1)} MB/s)
    Upload will complete in ${completionTime} [HH:MM:SS]`;

    const previousLoaded = loaded;
    const previousTime = Date.now() / 1000;
    const previousPercentageComplete = percentageComplete;
}

// Abort the upload request if the cancel button is clicked.
export function abortUpload(progressFilenameRequest) {
    progressFilenameRequest.abort();
    show_alert(`Upload cancelled`, "info");
    reset();
}

// A export function that resets the page.
export function reset() {
    document.getElementById("converting_btn").style.display = 'none ';
    conversionProgress.style.display = 'none';
    input.disabled = false;
    input.value = '';
    inputLabel.innerText = "Select file";
    convertButton.classList.remove("d-none");
    document.getElementById("converting_btn").style.display = 'none';
    document.getElementById("progress").style.display = 'none';
    cancelButton.classList.add('d-none');
    outputNameBox.disabled = false;
    uploadingButton.classList.add('d-none');
    progressWrapper.style.display = 'none';
    outputNameBox.value = '';
    progressParagraph.style.display = 'none';
}
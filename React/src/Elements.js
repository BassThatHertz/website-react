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

export default {
    input,
    urlInput,
    inputLabel,
    outputNameBox,
    conversionProgress,
    progressWrapper,
    progressStatus,
    convertButton,
    uploadingButton,
    cancelButton,
    alertWrapper,
    progressBar,
    progressParagraph
};
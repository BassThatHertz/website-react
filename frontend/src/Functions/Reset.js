
const urlInput = document.getElementById("url");




const progressStatus = document.getElementById("progress_status");



const alertWrapper = document.getElementById("alert_wrapper");
const progressBar = document.getElementById('progress_bar');


function reset() {
    const convertButton = document.getElementById("convert_btn");
    const cancelButton = document.getElementById("cancel_btn");
    const outputNameBox = document.getElementById("output_name");
    const uploadingButton = document.getElementById("uploading_btn");
    const progressWrapper = document.getElementById("progress_wrapper");
    const progressParagraph = document.getElementById('progress');

    document.getElementById("converting_btn").style.display = 'none ';
    const conversionProgress = document.getElementById("progress");
    conversionProgress.style.display = 'none';
    const input = document.getElementById("file_input");
    input.disabled = false;
    input.value = '';
    const inputLabel = document.getElementById("file_input_label");
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

export default reset;
document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const outputFormat = document.getElementById('outputFormat');
    const file = fileInput.files[0];

    // Clear previous options
    outputFormat.innerHTML = '<option value="">Select Output Format</option>';

    if (file) {
        const fileType = file.type;

        // Suggest conversion options based on file type
        if (fileType.startsWith('image/')) {
            outputFormat.innerHTML += '<option value="pdf">Convert to PDF</option>';
            outputFormat.innerHTML += '<option value="png">Convert to PNG</option>';
            outputFormat.innerHTML += '<option value="jpg">Convert to JPG</option>';
            outputFormat.innerHTML += '<option value="gif">Convert to GIF</option>';
            outputFormat.innerHTML += '<option value="bmp">Convert to BMP</option>';
            outputFormat.innerHTML += '<option value="tiff">Convert to TIFF</option>';
            outputFormat.innerHTML += '<option value="svg">Convert to SVG</option>';
            outputFormat.innerHTML += '<option value="webp">Convert to WebP</option>';
            outputFormat.innerHTML += '<option value="ico">Convert to ICO</option>';
        } else if (fileType === 'text/plain' || fileType === 'application/pdf' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            outputFormat.innerHTML += '<option value="pdf">Convert to PDF</option>';
            outputFormat.innerHTML += '<option value="doc">Convert to DOC</option>';
            outputFormat.innerHTML += '<option value="docx">Convert to DOCX</option>';
            outputFormat.innerHTML += '<option value="txt">Convert to TXT</option>';
        } else if (fileType.startsWith('audio/')) {
            outputFormat.innerHTML += '<option value="mp3">Convert to MP3</option>';
            outputFormat.innerHTML += '<option value="wav">Convert to WAV</option>';
            outputFormat.innerHTML += '<option value="flac">Convert to FLAC</option>';
            outputFormat.innerHTML += '<option value="aac">Convert to AAC</option>';
            outputFormat.innerHTML += '<option value="ogg">Convert to OGG</option>';
        } else if (fileType.startsWith('video/')) {
            outputFormat.innerHTML += '<option value="mp4">Convert to MP4</option>';
            outputFormat.innerHTML += '<option value="avi">Convert to AVI</option>';
            outputFormat.innerHTML += '<option value="mkv">Convert to MKV</option>';
            outputFormat.innerHTML += '<option value="mov">Convert to MOV</option>';
            outputFormat.innerHTML += '<option value="wmv">Convert to WMV</option>';
        } else {
            alert('Unsupported file type. Please upload an image, audio, video, or text file.');
        }
    }
});

document.getElementById('convertButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const outputFormat = document.getElementById('outputFormat').value;
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('downloadLink');

    if (fileInput.files.length === 0) {
        resultDiv.innerHTML = 'Please select a file to convert.';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        if (file.type.startsWith('image/')) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let blobType;

                switch (outputFormat) {
                    case 'pdf':
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF();
                        pdf.addImage(img, 'JPEG', 10, 10, 190, 0);
                        const pdfBlob = pdf.output('blob');
                        updateDownloadLink(pdfBlob, file.name, 'pdf');
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                    case 'tiff':
                    case 'webp':
                        blobType = `image/${outputFormat}`;
                        canvas.toBlob(function(blob) {
                            updateDownloadLink(blob, file.name, outputFormat);
                        }, blobType);
                        break;
                    case 'svg':
                        const svgData = canvasToSVG(canvas);
                        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
                        updateDownloadLink(svgBlob, file.name, 'svg');
                        break;
                    case 'ico':
                        canvas.toBlob(function(blob) {
                            updateDownloadLink(blob, file.name, 'ico');
                        }, 'image/x-icon');
                        break;
                    default:
                        resultDiv.innerHTML = 'Invalid conversion. Please select a valid output format for the selected file type.';
                        break;
                }
            };
        } else if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            let blobType;
            switch (outputFormat) {
                case 'pdf':
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF();
                    pdf.text(event.target.result, 10, 10);
                    const pdfBlob = pdf.output('blob');
                    updateDownloadLink(pdfBlob, file.name, 'pdf');
                    break;
                case 'doc':
                    blobType = 'application/msword';
                    const docBlob = new Blob([event.target.result], { type: blobType });
                    updateDownloadLink(docBlob, file.name, 'doc');
                    break;
                case 'docx':
                    blobType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    const docxBlob = new Blob([event.target.result], { type: blobType });
                    updateDownloadLink(docxBlob, file.name, 'docx');
                    break;
                case 'txt':
                    blobType = 'text/plain';
                    const txtBlob = new Blob([event.target.result], { type: blobType });
                    updateDownloadLink(txtBlob, file.name, 'txt');
                    break;
                default:
                    resultDiv.innerHTML = 'Invalid conversion. Please select a valid output format for the selected file type.';
                    break;
            }
        } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
            let blobType;
            switch (outputFormat) {
                case 'mp3':
                    blobType = 'audio/mpeg';
                    break;
                case 'wav':
                    blobType = 'audio/wav';
                    break;
                case 'flac':
                    blobType = 'audio/flac';
                    break;
                case 'aac':
                    blobType = 'audio/aac';
                    break;
                case 'ogg':
                    blobType = 'audio/ogg';
                    break;
                case 'mp4':
                    blobType = 'video/mp4';
                    break;
                case 'avi':
                    blobType = 'video/x-msvideo';
                    break;
                case 'mkv':
                    blobType = 'video/x-matroska';
                    break;
                case 'mov':
                    blobType = 'video/quicktime';
                    break;
                case 'wmv':
                    blobType = 'video/x-ms-wmv';
                    break;
                default:
                    resultDiv.innerHTML = 'Invalid conversion. Please select a valid output format for the selected file type.';
                    return;
            }
            const mediaBlob = new Blob([arrayBuffer], { type: blobType });
            updateDownloadLink(mediaBlob, file.name, outputFormat);
        } else {
            resultDiv.innerHTML = 'Unsupported file type. Please upload an image, audio, video, or text file.';
        }
    };

    if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
    } else if (file.type === 'text/plain' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.readAsText(file);
    } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        reader.readAsArrayBuffer(file);
    } else {
        resultDiv.innerHTML = 'Unsupported file type. Please upload an image, audio, video, or text file.';
    }
});

function updateDownloadLink(blob, fileName, extension) {
    const url = URL.createObjectURL(blob);
    const outputFileName = fileName.split('.').slice(0, -1).join('.') + '.' + extension;
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('downloadLink');

    resultDiv.innerHTML = `Converted ${fileName} to ${extension.toUpperCase()}`;
    downloadLink.href = url;
    downloadLink.download = outputFileName;
    downloadLink.style.display = 'block';
    downloadLink.innerHTML = 'Download Converted File';
}

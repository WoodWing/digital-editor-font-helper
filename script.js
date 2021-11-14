// Check for the File API support.
function init() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}

function handleFileSelect(evt) {

  var f = evt.target.files[0]; // FileList object
  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {
      var binaryData = e.target.result;

      //Converting Binary Data to base 64
      var base64String = window.btoa(binaryData);

      //showing file converted to base64
      var fileNameElements = f.name.split('.');
      var extension = fileNameElements.pop();
      var fontName =  fileNameElements.join(".");
      
      mimeType = "";
      if (extension === "ttf") {
        mimeType = "application/x-font-truetype";
      } else if (extension === "woff") {
        mimeType = "application/font-woff";
      } else if (extension === "woff2") {
        mimeType = "application/font-woff2";
      }

      if (mimeType) {
        cssFontFace = "/*Character Style cs-" + fontName + "*/\n" +
                "@font-face { \n" +
                "   font-family: '" + fontName + "';\n" +
                "   src: url('data:" + mimeType + ";base64," + base64String + "') \n" +
                "   format('" + extension + "'); font-style: normal; font-weight: normal \n" +
                "}\n" + 
                ".cs-" + fontName + "{\n" +
                "   font-famlify: '" + fontName + "'\n" +
                "}";

        document.getElementById('charachterStyleTA').value = cssFontFace;

      } else {
        alert("Please select a TTF, WOFF or WOFF2 font")
      }
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsBinaryString(f);
}

/**
 * Copy the text of the provided textArea to the clipboard
 */
function copyToClipboard(textArea) {
  textArea.select();
  document.execCommand("copy");
}

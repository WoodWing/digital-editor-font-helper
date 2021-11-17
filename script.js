// Check for the File API support.
function init() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}

/**
 * Convert the uploaded font
 * @param {*} evt 
 */
function handleFileSelect(evt) {

  var f = evt.target.files[0]; // FileList object
  var reader = new FileReader();
  // Closure to capture the file information.
  reader.onload = (function (theFile) {
    return function (e) {
      var arrayBuffer = e.target.result;

      //Converting Binary Data to base 64            
      var base64String = window.btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      
      var extension = f.name.split('.').pop();
      const font = opentype.parse(arrayBuffer);
      console.log (font);
      var fontFamily = font.names.fullName.en;
      var charStyleName = "cs-" + fontFamily.replaceAll(" ", "-").toLowerCase();


      var mimeType = "";
      if (extension === "ttf") {
        mimeType = "application/x-font-truetype";
      } else if (extension === "woff") {
        mimeType = "application/font-woff";
      } else if (extension === "woff2") {
        mimeType = "application/font-woff2";
      }

      if (mimeType) {
        charachterStyleCSS = 
`/*Character Style ${charStyleName} */
@font-face {
  font-family: '${fontFamily}';
  src: url('data:${mimeType};base64,${base64String}')
}

.${charStyleName} {
  font-family: '${fontFamily}'
}`;
        
        
        
        
        "/*Character Style " + charStyleName + "*/\n" +
                "@font-face { \n" +
                "   font-family: '" + fontFamily + "';\n" +
                "   src: url('data:" + mimeType + ";base64," + base64String + "') \n" +
                "   format('" + extension + "'); font-style: normal; font-weight: normal \n" +
                "}\n" + 
                "." + charStyleName + "{\n" +
                "   font-famlify: '" + fontFamily + "'\n" +
                "}";

        anStyle = 
`{
  "selector": {
    "textStyle": "${charStyleName}"
  },
  "properties": {
    "fontName": "${fontFamily}"
  }
}`;
                
        document.getElementById('charachterStyleNameInput').value = fontFamily;
        document.getElementById('charachterStyleTechNameInput').value = charStyleName;
        document.getElementById('charachterStyleCSSTA').value = charachterStyleCSS;
        document.getElementById('anStyleTA').value = anStyle;
      } else {
        alert("Please select a TTF, WOFF or WOFF2 font")
      }
    };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsArrayBuffer(f);
}

/**
 * Copy the text of the provided textArea to the clipboard
 */
function copyToClipboard(textArea) {
  textArea.select();
  document.execCommand("copy");
}

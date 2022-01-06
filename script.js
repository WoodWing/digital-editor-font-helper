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

  var f = evt.target.files[0]; 
  var reader = new FileReader();
  
  reader.onload = (function (theFile) {
    return function (e) {
      var arrayBuffer = e.target.result;

      //Converting font to base 64            
      var base64String = window.btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      //Extract font information
      var extension = f.name.split('.').pop().toLowerCase();
      const font = opentype.parse(arrayBuffer);
      console.log (font);
      var fontFamily = font.names.fullName.en;
      var postScriptName = font.names.postScriptName.en;
      var charStyleName = "cs-" + fontFamily.replaceAll(" ", "-").toLowerCase();      
      var mimeType = "";
      if (extension === "ttf") {
        mimeType = "application/x-font-truetype";
      } else if (extension === "woff") {
        mimeType = "application/font-woff";
      } else if (extension === "woff2") {
        mimeType = "application/font-woff2";
      } else {
        alert("Please select a TTF, WOFF or WOFF2 font")
        return;
      }
      
      //Create CSS + AN
      charachterStyleCSS = 
`/*Character Style ${charStyleName} */
@font-face {
  font-family: '${postScriptName}';
  src: url('data:${mimeType};base64,${base64String}')
}

.${charStyleName} {
  font-family: '${postScriptName}'
}`;
                
      anStyle = 
`{
  "selector": {
    "textStyle": "${charStyleName}"
  },
  "properties": {
    "fontName": "${postScriptName}"
  }
}`;

      //Update UI       
      document.getElementById('charachterStyleNameInput').value = fontFamily;
      document.getElementById('charachterStyleTechNameInput').value = charStyleName;
      document.getElementById('charachterStyleCSSTA').value = charachterStyleCSS;
      document.getElementById('anStyleTA').value = anStyle;
    };
  })(f);

  // Read in the font as array buffer
  reader.readAsArrayBuffer(f);
}

/**
 * Copy the text of the provided html element to the clipboard
 */
function copyToClipboard(element) {
  element.select();
  document.execCommand("copy");
}

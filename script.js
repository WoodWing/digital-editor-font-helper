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
      const arrayBuffer = e.target.result;

      //Converting font to base 64            
      var base64String = window.btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      //Extract font information
      const extension = f.name.split('.').pop().toLowerCase();
      const font = opentype.parse(arrayBuffer);
      console.log (font);
      const fontFamily = font.names.fullName.en;
      const postScriptName = font.names.postScriptName.en;
      const charStyleName = fontFamily.replaceAll(" ", "-").toLowerCase();
      let mimeType = "";
      // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face#font_mime_types
      if (extension === "ttf") {
        mimeType = "font/ttf";
      } else if (extension === "otf") {
        mimeType = "font/otf";
      } else if (extension === "woff") {
        mimeType = "font/woff";
      } else if (extension === "woff2") {
        mimeType = "font/woff2";
      } else {
        alert("Please select a ttf, otf, woff or woff2 font")
        return;
      }
      
      //Create CSS + AN
      const characterStyleCSS =
`/*Character Style cs-${charStyleName} */
@font-face {
  font-family: '${postScriptName}';
  src: url('data:${mimeType};base64,${base64String}')
}

.cs-${charStyleName} {
  font-family: '${postScriptName}'
}`;
                
      const anStyle =
`{
  "selector": {
    "textStyle": "cs-${charStyleName}"
  },
  "properties": {
    "fontName": "${postScriptName}"
  }
}`;

      //Update UI       
      document.getElementById('characterStyleNameInput').value = fontFamily;
      document.getElementById('characterStyleTechNameInput').value = charStyleName;
      document.getElementById('characterStyleCSSTA').value = characterStyleCSS;
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

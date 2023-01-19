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
  // Grab file frop drop event or file upload
  const file = evt.target.files[0];

  // Use FileReader to, well, read the file
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (e) => {
    //Converting font to base 64            
    const arrayBuffer = e.target.result;
    var base64String = window.btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )

    // Create a font object
    const font = new Font("My Font Name");

    // Pass the buffer, and the original filename
    font.fromDataBuffer(reader.result, file.name);

    font.onload = (evt) => {


      // Map the details LibFont gathered from the font to the
      // "font" variable
      const font = evt.detail.font;

      // From all the OpenType tables in the font, take the "name"
      // table so we can inspect it further
      const { name } = font.opentype.tables;

      // https://docs.microsoft.com/en-us/typography/opentype/spec/name
      const extension = file.name.split('.').pop().toLowerCase();
      const fontFamily = name.get(4);
      const postScriptName = name.get(6);
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

    }
  }

}

/**
 * Copy the text of the provided html element to the clipboard
 */
function copyToClipboard(element) {
  element.select();
  document.execCommand("copy");
}

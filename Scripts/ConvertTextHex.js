function HexToText(text, inbytecom) {
  var newtext = '';
  const bytelen = parseInt(inbytecom.match(/<byte(.*?)>/)[1]);
  for (b of text.matchAll(inbytecom.fixForRegex().replace(/<byte(.*?)>/, `([\\da-fA-F]{${bytelen*2}})`).toRegex('g')) || []) {newtext += b[1].hexDecode()}
  return newtext;
}

function TextToHex(text, outbytecom) {
  var newtext = '';
  const bytelen = parseInt(outbytecom.match(/<byte(.*?)>/)[1]);
  for (char of text) {newtext += outbytecom.replace(/<byte(.*?)>/, char.hexEncode(bytelen))}
  return newtext;
}
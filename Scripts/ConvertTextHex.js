function HexToText(text, byte1reg) {
  var newtext = '';
  for (b of text.matchAll(byte1reg.toRegex('g')) || []) {newtext += b[1].hexDecode()}
  return newtext;
}

function TextToHex(text, byte2reg) {
  var newtext = '';
  for (char of text) {newtext += byte2reg.replace(/\[\\da-fA-F\]\{\d*\}/, char.hexEncode(parseInt([...byte2reg.matchAll(/\{(\d)\}/g)][0][1])/2))}
  return newtext;
}
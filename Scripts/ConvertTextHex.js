function ConvertTextHex(text, byteform, bytelen, c=true) {
  var newtext = '';
  if (c) {
    text = text.hexEncode(bytelen);
    for (i of range(0, text.length, bytelen*2)) {newtext += byteform.replace('<byte>', text.slice(i, i+bytelen*2))}
  }
  else {
    const bytes = text.match(byteform.fixForRegex().replace('<byte>', "[0-9,a-f,A-F]".repeat(bytelen*2)).toRegex('g'));
    if (!bytes) {return ''}
    for (b of bytes) {
      const value = b.slice(byteform.indexOf('<byte>'), byteform.indexOf('<byte>')+bytelen*2);
      newtext += value.hexDecode(bytelen);
    }
  }
  return newtext;
}
function save_table(name, charmap) {
  var content = "";
  if      (name.endsWith('.act')) {content = save_ACT(charmap)}
  else if (name.endsWith('.tbl')) {content = save_TBL(charmap)}
  else {return}
  content.downloadAsFile(name);
}

function save_ACT(charmap) {
  var content = ACT_DESC;
  for ([k, v] of Object.entries(sort_arabic(charmap))) {
    content += `\n${k}${A_SEPARATOR}${v.join(A_SEPARATOR)}`;
  }
  return content;
}

function save_TBL(charmap) {
  var content = "";
  for ([k, v] of Object.entries(charmap)) {
    var hex = v.hexEncode();
    if (hex.startsWith("00")) {hex = hex.slice(2)}
    content += `${hex}=${k}\n`;
  }
  return content;
}

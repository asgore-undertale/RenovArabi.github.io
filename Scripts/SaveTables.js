function saveTable(name, charmap) {
  var content = "";
  if      (name.endsWith('.act')) {content = saveACT(charmap)}
  else if (name.endsWith('.tbl')) {content = saveTBL(charmap)}
  else {return}
  content.downloadAsFile(name);
}

function saveACT(charmap) {
  var content = _ACT_DESC_;
  for ([k, v] of Object.entries(sortArabic(charmap))) {
    content += `\n${k}${_A_SEPARATOR_}${v.join(_A_SEPARATOR_)}`;
  }
  return content;
}

function saveTBL(charmap) {
  var content = "";
  for ([k, v] of Object.entries(charmap)) {
    var hex = v.hexEncode();
    if (hex.startsWith("00")) {hex = hex.slice(2)}
    content += `${hex}=${k}\n`;
  }
  return content;
}

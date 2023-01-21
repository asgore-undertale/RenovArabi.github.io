function compress_text(text, used_dtes) {
  if (!text.length) {return ""}
  for (dte of used_dtes) {
    if (!(dte in MERGED_ARABIC_TABLE)) {
      continue;
    }
    text = text.replaceAll(MERGED_ARABIC_TABLE[dte], dte);
  }
  return text;
}

function uncompress_text(text) { // used_dtes
  for (const [k, v] of Object.entries(MERGED_ARABIC_TABLE)) {
    text = text.replaceAll(k, v);
  }
  return text;
}

function suggest_dte(text, dteLengths, resultsNum) {
  return [].concat(...dteLengths.map(x => text.subs(x))).removeDublicatedItems().sort((a, b) => {return text.count(b) - text.count(a)}).slice(0, resultsNum);
}
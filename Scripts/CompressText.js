function CompressText(text, usedDtes) {
  if (!text.length) {return ""}
  
  for (dte of usedDtes) {
    text = text.replaceAll(mergedArabicChars[dte], dte);
  }
  
  return text;
}

function UncompressText(text) {
  for (const [k, v] of Object.entries(mergedArabicChars)) {
    text = text.replaceAll(k, v);
  }
  return text;
}

function SuggestDTE(text, dteLengths, resultsNum) {
  const dtesList = [].concat(...dteLengths.map(x => text.subs(x))).removeDublicatedItems().sort((a, b) => {return text.count(b) - text.count(a)}).slice(0, resultsNum);
  return dtesList;
}
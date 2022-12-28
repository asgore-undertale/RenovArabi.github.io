function CompressText(text, dteLengths, resultsNum, usedDtes) {
  if (!text.length) {return ""}
  
  const dtesList = [].concat(...dteLengths.map(x => text.subs(x))).removeDublicatedItems().filter(x => (x in mergedArabicChars && usedDtes.includes(x)));
  
  for (const i of range(0, min(resultsNum, dtesList.length))) {
    dtesList.sort((a, b) => {return text.count(b) - text.count(a)});
    
    const dte = dtesList[0];
    const dteCount = text.count(dte);
    if (!dteCount) {break};
    delete dtesList[0];
    const mergedDte = mergedArabicChars[dte];
    const l = text.length;
    
    text = text.replaceAll(dte, mergedDte);
    console.log(`[${mergedDte}]   [${dteCount}]   طول النص   (${text.length - l})`);
  }
  console.log("-----")
  
  return text;
}

function UncompressText(text) {
  for (const [k, v] of Object.entries(mergedArabicChars)) {
    text = text.replaceAll(v, k);
  }
  return text;
}

function SuggestDTE(text, dteLengths, resultsNum) {
  const dtesList = [].concat(...dteLengths.map(x => text.subs(x))).removeDublicatedItems().sort((a, b) => {return text.count(b) - text.count(a)}).slice(0, resultsNum);
  return dtesList;
}
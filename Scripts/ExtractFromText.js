function ExtractFromText(text, extractreg, extractedlength) {
  return ([...text.matchAll(extractreg.toRegex("g"))] || []).filter(x => x[1].length >= extractedlength[0] && x[1].length <= extractedlength[1]).map(x => x[1]);
}
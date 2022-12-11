function ExtractFromText(text, extractreg) {
  return ([...text.matchAll(extractreg.toRegex("g"))] || []);
}
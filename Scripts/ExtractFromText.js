function ExtractFromText(text, extractcom, extractedlength) {
  return (text.match(extractcom.fixForRegex().replaceAll("<text>", "(.+?)").toRegex("g")) || []).filter(x => x.length >= extractedlength[0] && x.length <= extractedlength[1]);
}
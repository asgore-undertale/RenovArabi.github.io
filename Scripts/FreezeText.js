function Freeze(text, mergla=true) {
  var aroundbefore, aroundafter, before, after, newtext = "";
  const arabic = ArabicChars+Harakat;
  const allharakat = Harakat+FreezedHarakat;
  text = " " + text + " ";
  
  for (var i of range(1, text.length-1)) {
    if (!(arabic).includes(text[i])) {newtext += text[i]; continue}
    aroundbefore = 1, aroundafter = 1;
    while ((allharakat).includes(text[i - aroundbefore])) {aroundbefore += 1};
    if (CharsConnectBoth.includes(text[i - aroundbefore])) {before = 1} else {before = 0};
    while ((allharakat).includes(text[i + aroundafter])) {aroundafter += 1};
    if (CharsConnectBoth.includes(text[i]) && (CharsConnectBoth.includes(text[i + aroundafter]) || CharsConnectBefore.includes(text[i + aroundafter]))) {after = 1} else {after = 0};
    
    if (!(text[i] in freezedArabicTable)) {newtext += text[i]} else {
      if (before === 0 && after === 1) {newtext += freezedArabicTable[text[i]][0]};
      if (before === 1 && after === 1) {newtext += freezedArabicTable[text[i]][1]};
      if (before === 1 && after === 0) {newtext += freezedArabicTable[text[i]][2]};
      if (before === 0 && after === 0) {newtext += freezedArabicTable[text[i]][3]};
    };
  }
  
  if (mergla) {
    for (var la of LaList) {
      newtext = newtext.replaceAll(la[0], la[1]);
    }
  }
  
  return newtext;
}

function UnFreeze(text="") {
  for (const [key, value] of Object.entries(freezedArabicTable)) {
    for (var v of value) {text = text.replaceAll(v, key)}
  }
  return text
}

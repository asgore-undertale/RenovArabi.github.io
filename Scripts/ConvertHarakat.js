function DelHarakat(text) {
  for (var haraka of Harakat+FreezedHarakat) {text = text.replaceAll(haraka, '')}
  return text;
}

function MergeHarakat(text) {
  for (var [key, value] of Object.entries(mergedHarakatTable)) {text = text.replace(value, key)}
  return text;
}

function KeepFirstHaraka(text) {
  var newtext = '';
  text = ' ' + text;
  for (i of range(1, text.length)) {
    if (!((Harakat+FreezedHarakat).includes(text[i])) || (!((Harakat+FreezedHarakat).includes(text[i-1])))) {newtext += text[i]}
  }
  return newtext;
}

function ConnectHarakat(text) {
  var newtext = "";
  text = " " + text + " ";
  for (var i of range(1, text.length-1)) {
    if (!(Harakat+FreezedHarakat).includes(text[i]) || (text[i] in connectedHarakatTable)) {newtext += text[i]; continue}
    
    var aroundbefore = 1, aroundafter = 1;
    while ((Harakat+FreezedHarakat).includes(text[i-aroundbefore])) {aroundbefore += 1}
    if (!CharsConnectBoth.includes(text[i - aroundbefore])) {newtext += text[i]; continue}
    while ((Harakat+FreezedHarakat).includes(text[i+aroundafter])) {aroundafter += 1}
    if (!(CharsConnectBoth+CharsConnectBefore).includes(text[i + aroundafter])) {newtext += text[i]; continue}
    
    for (var [key, value] of Object.entries(connectedHarakatTable)) {
      if (value.includes(text[i])) {newtext += key; break}
	}
  }
  return newtext;
}

function MoveHaraka(text, step) {
  var newtext = DelHarakat(text);
  for (c of range(0, text.length)) {
    if (!(Harakat+FreezedHarakat).includes(text[c])) {continue}
    if (c+step<0) {var insertindex = 0}
    else if (c+step>text.length) {var insertindex = text.length}
    else {var insertindex = c+step}
    newtext = newtext.insert(text[c], insertindex)
  }
  return newtext
}
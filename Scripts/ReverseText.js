const fullStack = ArabicChars + FreezedArabicChars + NeutralChars + Harakat + FreezedHarakat + Returns + BowsList.join("");

function ReverseAll(text) {
  var newtext = "";
  for (var i of range(0, text.length)) {newtext += text[text.length-1-i]}
  return newtext;
}

function ReverseArabic(text) {
  var container = '';
  var newtext = [""];
  for (var i of range(0, text.length)) {
    if (fullStack.includes(text.charAt(i))) {
      container += text.charAt(i);
    }
    else {
      if (container.length) {
        newtext.push(ReverseAll(container));
        newtext.push("")
        container = '';
      }
      newtext[newtext.length-1] += text.charAt(i);
    }
  }
  newtext.push(ReverseAll(container));
    
  return reverseBows(newtext.reverse().join(""));
}

function reverseBows(text) {
  for (bow of BowsList) {
    text = text.replace(bow[0], '\uFFFF').replace(bow[1], bow[0]).replace('\uFFFF', bow[1]);
  }
  return text;
}

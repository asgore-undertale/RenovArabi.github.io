function reverse_all(text) {
  var newtext = "";
  for (var i of range(0, text.length)) {newtext += text[text.length-1-i]}
  return newtext;
}

function reverse_arabic(text) {
  var container = '';
  var newtext = [""];
  for (var i of range(0, text.length)) {
    if (FULL_ARABIC.includes(text.charAt(i))) {
      container += text.charAt(i);
    }
    else {
      if (container.length) {
        newtext.push(reverse_all(container));
        newtext.push("")
        container = '';
      }
      newtext[newtext.length-1] += text.charAt(i);
    }
  }
  newtext.push(reverse_all(container));
    
  return reverse_bows(newtext.reverse().join(""));
}

function reverse_bows(text) {
  for (bow of BOWS_LIST) {
    text = text.replace(bow[0].fixForRegex().toRegex('g'), '\uFFFF').replace(bow[1].fixForRegex().toRegex('g'), bow[0]).replace('\uFFFF'.fixForRegex().toRegex('g'), bow[1]);
  }
  return text;
}

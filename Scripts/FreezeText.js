function freeze(text) {
  var newtext = "";
  var before_char = " ";
  var after_char = " ";
  var after_char_i = 0;
  
  for (var i of range(0, text.length)) {
    var c = text[i];
    if (!(c in FREEZED_ARABIC_TABLE)) {
      newtext += c;
      if (!(ALL_HARAKAT.includes(c))) {
        before_char = c;
	  }
      continue;
	}
	var j = 0;
    j += CHARS_CONNECT_BOTH.includes(before_char);
	if (!(ALL_HARAKAT.includes(c))) {
      before_char = c;
	}
    if (i == text.length-1) {
      after_char = " ";
	}
    else if (i >= after_char_i) {
      after_char_i = i + 1;
      while (after_char_i != text.length-1 && ALL_HARAKAT.includes(text[after_char_i])) {
        after_char_i += 1;
	  }
      after_char = text[after_char_i];
	}
    if (CHARS_CONNECT_BOTH.includes(c) && (CHARS_CONNECT_BOTH.includes(after_char) || CHARS_CONNECT_BEFORE.includes(after_char))) {
      j += 2;
    }
	newtext += FREEZED_ARABIC_TABLE[c][j];
  }
  return newtext;
}

function un_freeze(text) {
  for (const [key, value] of Object.entries(FREEZED_ARABIC_TABLE)) {
    text = text.replace(("[" + value.join("") + "]").toRegex("g"), key);
  }
  return text;
}

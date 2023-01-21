function del_harakat(text) {
  return text.replace(HARAKAT_PATTERN.toRegex("g"), "")
}

function keep_first_haraka(text) {
  return text.replace(("(" + HARAKAT_PATTERN + ")" + HARAKAT_PATTERN + "+").toRegex("g"), "$1")
}

function merge_harakat(text) {
  for (const [key, value] of Object.entries(MERGED_HARAKAT_TABLE)) {
    text = text.replace(value, key)
  }
  return text;
}

function offset_harakat(text, offset) {
  var newtext = del_harakat(text);
  for (c of range(0, text.length)) {
    if (!ALL_HARAKAT.includes(text[c])) {continue;}
    newtext = newtext.insert(text[c], min(max(c+offset, 0), newtext.length))
  }
  return newtext
}

function connect_harakat(text) {
  const pattern1 = "([" + CHARS_CONNECT_BOTH + "])";
  const pattern3 = "([" + CHARS_CONNECT_BOTH + CHARS_CONNECT_BEFORE + "])";
  for (const [k, v] of Object.entries(CONNECTED_HARAKAT_TABLE)) {
    const pattern2 = "[" + v + "]";
    const re = pattern1 + "(" + HARAKAT_PATTERN + "*)" + pattern2 + "(" + HARAKAT_PATTERN + "*)" + pattern3;
    text = text.replace(re.toRegex("g"), "$1$2" + k + "$3$4");
  }
  return text;
}
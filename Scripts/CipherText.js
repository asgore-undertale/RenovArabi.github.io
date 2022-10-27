function Cipher(text, ciphertable, defaultvalue, swaptableitems=true, notintable=0) {
  if (!Object.keys(ciphertable).length) {
    if (notintable==0) {return text}
    if (notintable==1) {return defaultvalue.repeat(text.length)}
    return ''
  }
  if (swaptableitems) {ciphertable = ciphertable.swapKeysAndValues().removeEmptyStringKeys()}
  /*
  var newtext = ''
  for (var i of range(0, text.length)) {
    if (text[i] in ciphertable) {newtext += ciphertable[text[i]]; continue}
    if (notintable==0) {newtext += text[i]; continue}
    if (notintable==1) {newtext += defaultvalue; continue}
  }
  return newtext;*/
  
  ciphertable = ciphertable.sort(function(a,b) {return b.length - a.length});
  for (const [k, v] of Object.entries(ciphertable)) {
    text = text.replaceAll(k, v);
  }
  return text;
}

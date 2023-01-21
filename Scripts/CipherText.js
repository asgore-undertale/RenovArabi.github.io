function cipher(text, ciphertable, swaptableitems=false) {
  if (!Object.keys(ciphertable).length || !text.length) {
    return text;
  }
  if (swaptableitems) {
    ciphertable = ciphertable.swapKeysAndValues().removeEmptyStringKeys();
  }
  for (const [k, v] of Object.entries(ciphertable)) {
    text = text.replaceAll(k, v);
  }
  return text;
}

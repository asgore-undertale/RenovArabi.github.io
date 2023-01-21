function extract_from_text(text, ex_pattern) {
  return ([...text.matchAll(ex_pattern.toRegex("g"))] || []);
}
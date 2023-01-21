function complete_arabic(charmap) {
  const values = Object.values(FREEZED_ARABIC_TABLE);
  for (var value of values) {
    if (value[0] in charmap && value[1] in charmap && value[2] in charmap && value[3] in charmap) {continue}
    if      (!(value[1] in charmap) && (value[0] in charmap)) {charmap[value[1]] = charmap[value[0]]}
    else if (!(value[0] in charmap) && (value[1] in charmap)) {charmap[value[0]] = charmap[value[1]]}
    if      (!(value[3] in charmap) && (value[2] in charmap)) {charmap[value[3]] = charmap[value[2]]}
    else if (!(value[2] in charmap) && (value[3] in charmap)) {charmap[value[2]] = charmap[value[3]]}
    if      (!(value[1] in charmap) && (value[2] in charmap)) {charmap[value[1]] = charmap[value[2]]}
    else if (!(value[2] in charmap) && (value[1] in charmap)) {charmap[value[2]] = charmap[value[1]]}
    if      (!(value[0] in charmap) && (value[3] in charmap)) {charmap[value[0]] = charmap[value[3]]}
    else if (!(value[3] in charmap) && (value[0] in charmap)) {charmap[value[3]] = charmap[value[0]]}
  }
  return charmap
}

function sort_arabic(charmap) {
  for (const char of Object.keys(FREEZED_ARABIC_TABLE)) {
    var values = FREEZED_ARABIC_TABLE[char];
    charmap[char] = values.map(x => charmap[x]).replaceItems(undefined, '');
    for (const value of values) {delete charmap[value]}
  }
  for (const [k, v] of Object.entries(charmap)) {
    if (typeof(v) == "string") {charmap[k] = ["", "", "", v]; continue}
    if (v.join('') == '') {delete charmap[k]}
  }
  return charmap;
}

function one_one_charmap(charmap) {
  if (!Object.keys(charmap).length) {return {}}
  var newcharmap = {};
  for (const [key, value] of Object.entries(charmap)) {
    for (var i of range(0, 4-value.length)) (value.push(''))
    if (key == 'ً') {newcharmap['ﹰ'] = value[3]; continue}
    if (key == 'َ') {newcharmap['ﹶ'] = value[3]; continue}
    if (key == 'ٌ') {newcharmap['ﹲ'] = value[3]; continue}
    if (key == 'ُ') {newcharmap['ﹸ'] = value[3]; continue}
    if (key == 'ٍ') {newcharmap['ﹴ'] = value[3]; continue}
    if (key == 'ِ') {newcharmap['ﹺ'] = value[3]; continue}
    if (key == 'ّ') {newcharmap['ﹼ'] = value[3]; continue}
    if (key == 'ْ') {newcharmap['ﹾ'] = value[3]; continue}
    if (key == 'ء') {newcharmap['ﺀ'] = value[3]; continue}
    if (key == 'آ') {newcharmap['ﺁ'] = value[3]; newcharmap['ﺂ'] = value[2]; continue}
    if (key == 'أ') {newcharmap['ﺃ'] = value[3]; newcharmap['ﺄ'] = value[2]; continue}
    if (key == 'ؤ') {newcharmap['ﺅ'] = value[3]; newcharmap['ﺆ'] = value[2]; continue}
    if (key == 'إ') {newcharmap['ﺇ'] = value[3]; newcharmap['ﺈ'] = value[2]; continue}
    if (key == 'ئ') {newcharmap['ﺉ'] = value[3]; newcharmap['ﺊ'] = value[2]; newcharmap['ﺌ'] = value[1]; newcharmap['ﺋ'] = value[0]; continue}
    if (key == 'ا') {newcharmap['ﺍ'] = value[3]; newcharmap['ﺎ'] = value[2]; continue}
    if (key == 'ب') {newcharmap['ﺏ'] = value[3]; newcharmap['ﺐ'] = value[2]; newcharmap['ﺒ'] = value[1]; newcharmap['ﺑ'] = value[0]; continue}
    if (key == 'ة') {newcharmap['ﺓ'] = value[3]; newcharmap['ﺔ'] = value[2]; continue}
    if (key == 'ت') {newcharmap['ﺕ'] = value[3]; newcharmap['ﺖ'] = value[2]; newcharmap['ﺘ'] = value[1]; newcharmap['ﺗ'] = value[0]; continue}
    if (key == 'ث') {newcharmap['ﺙ'] = value[3]; newcharmap['ﺚ'] = value[2]; newcharmap['ﺜ'] = value[1]; newcharmap['ﺛ'] = value[0]; continue}
    if (key == 'ج') {newcharmap['ﺝ'] = value[3]; newcharmap['ﺞ'] = value[2]; newcharmap['ﺠ'] = value[1]; newcharmap['ﺟ'] = value[0]; continue}
    if (key == 'ح') {newcharmap['ﺡ'] = value[3]; newcharmap['ﺢ'] = value[2]; newcharmap['ﺤ'] = value[1]; newcharmap['ﺣ'] = value[0]; continue}
    if (key == 'خ') {newcharmap['ﺥ'] = value[3]; newcharmap['ﺦ'] = value[2]; newcharmap['ﺨ'] = value[1]; newcharmap['ﺧ'] = value[0]; continue}
    if (key == 'د') {newcharmap['ﺩ'] = value[3]; newcharmap['ﺪ'] = value[2]; continue}
    if (key == 'ذ') {newcharmap['ﺫ'] = value[3]; newcharmap['ﺬ'] = value[2]; continue}
    if (key == 'ر') {newcharmap['ﺭ'] = value[3]; newcharmap['ﺮ'] = value[2]; continue}
    if (key == 'ز') {newcharmap['ﺯ'] = value[3]; newcharmap['ﺰ'] = value[2]; continue}
    if (key == 'س') {newcharmap['ﺱ'] = value[3]; newcharmap['ﺲ'] = value[2]; newcharmap['ﺴ'] = value[1]; newcharmap['ﺳ'] = value[0]; continue}
    if (key == 'ش') {newcharmap['ﺵ'] = value[3]; newcharmap['ﺶ'] = value[2]; newcharmap['ﺸ'] = value[1]; newcharmap['ﺷ'] = value[0]; continue}
    if (key == 'ص') {newcharmap['ﺹ'] = value[3]; newcharmap['ﺺ'] = value[2]; newcharmap['ﺼ'] = value[1]; newcharmap['ﺻ'] = value[0]; continue}
    if (key == 'ض') {newcharmap['ﺽ'] = value[3]; newcharmap['ﺾ'] = value[2]; newcharmap['ﻀ'] = value[1]; newcharmap['ﺿ'] = value[0]; continue}
    if (key == 'ط') {newcharmap['ﻁ'] = value[3]; newcharmap['ﻂ'] = value[2]; newcharmap['ﻄ'] = value[1]; newcharmap['ﻃ'] = value[0]; continue}
    if (key == 'ظ') {newcharmap['ﻅ'] = value[3]; newcharmap['ﻆ'] = value[2]; newcharmap['ﻈ'] = value[1]; newcharmap['ﻇ'] = value[0]; continue}
    if (key == 'ع') {newcharmap['ﻉ'] = value[3]; newcharmap['ﻊ'] = value[2]; newcharmap['ﻋ'] = value[1]; newcharmap['ﻌ'] = value[0]; continue}
    if (key == 'غ') {newcharmap['ﻍ'] = value[3]; newcharmap['ﻎ'] = value[2]; newcharmap['ﻐ'] = value[1]; newcharmap['ﻏ'] = value[0]; continue}
    if (key == 'ف') {newcharmap['ﻑ'] = value[3]; newcharmap['ﻒ'] = value[2]; newcharmap['ﻔ'] = value[1]; newcharmap['ﻓ'] = value[0]; continue}
    if (key == 'ق') {newcharmap['ﻕ'] = value[3]; newcharmap['ﻖ'] = value[2]; newcharmap['ﻘ'] = value[1]; newcharmap['ﻗ'] = value[0]; continue}
    if (key == 'ك') {newcharmap['ﻙ'] = value[3]; newcharmap['ﻚ'] = value[2]; newcharmap['ﻜ'] = value[1]; newcharmap['ﻛ'] = value[0]; continue}
    if (key == 'ل') {newcharmap['ﻝ'] = value[3]; newcharmap['ﻞ'] = value[2]; newcharmap['ﻠ'] = value[1]; newcharmap['ﻟ'] = value[0]; continue}
    if (key == 'م') {newcharmap['ﻡ'] = value[3]; newcharmap['ﻢ'] = value[2]; newcharmap['ﻤ'] = value[1]; newcharmap['ﻣ'] = value[0]; continue}
    if (key == 'ن') {newcharmap['ﻥ'] = value[3]; newcharmap['ﻦ'] = value[2]; newcharmap['ﻨ'] = value[1]; newcharmap['ﻧ'] = value[0]; continue}
    if (key == 'ه') {newcharmap['ﻩ'] = value[3]; newcharmap['ﻪ'] = value[2]; newcharmap['ﻬ'] = value[1]; newcharmap['ﻫ'] = value[0]; continue}
    if (key == 'و') {newcharmap['ﻭ'] = value[3]; newcharmap['ﻮ'] = value[2]; continue}
    if (key == 'ى') {newcharmap['ﻯ'] = value[3]; newcharmap['ﻰ'] = value[2]; continue}
    if (key == 'ي') {newcharmap['ﻱ'] = value[3]; newcharmap['ﻲ'] = value[2]; newcharmap['ﻴ'] = value[1]; newcharmap['ﻳ'] = value[0]; continue}
    if (key == 'لآ') {newcharmap['ﻵ'] = value[3]; newcharmap['ﻶ'] = value[2]; continue}
    if (key == 'لأ') {newcharmap['ﻷ'] = value[3]; newcharmap['ﻸ'] = value[2]; continue}
    if (key == 'لإ') {newcharmap['ﻹ'] = value[3]; newcharmap['ﻺ'] = value[2]; continue}
    if (key == 'لا') {newcharmap['ﻻ'] = value[3]; newcharmap['ﻼ'] = value[2]; continue}
    if (key == 'پ') {newcharmap['ﭖ'] = value[3]; newcharmap['ﭗ'] = value[2]; newcharmap['ﭙ'] = value[1]; newcharmap['ﭘ'] = value[0]; continue}
    if (key == 'چ') {newcharmap['ﭺ'] = value[3]; newcharmap['ﭻ'] = value[2]; newcharmap['ﭽ'] = value[1]; newcharmap['ﭼ'] = value[0]; continue}
    if (key == 'ڤ') {newcharmap['ﭪ'] = value[3]; newcharmap['ﭫ'] = value[2]; newcharmap['ﭭ'] = value[1]; newcharmap['ﭬ'] = value[0]; continue}
    newcharmap[key] = value[3];
  }
  return newcharmap;
}

async function load_table(file, complete_ar=true) {
  var charmap = {};
  const content = await readFile(file);
  // if (filePath.endsWith('.ttf')) {charmap = loadTTF(fileContent, chars, fontSize)}
  if      (file.name.endsWith('.fnt')) {charmap = load_fnt(content)}
  else if (file.name.endsWith('.aff')) {charmap = load_aff(content)}
  else if (file.name.endsWith('.act')) {charmap = load_act(content).sort(function(a,b) {return b.length - a.length})}
  else if (file.name.endsWith('.tbl')) {charmap = load_tbl(content).sort(function(a,b) {return b.length - a.length})}
  else if (file.name.endsWith('.zts')) {charmap = load_zts(content).sort(function(a,b) {return b.length - a.length})}
  else if (file.name.endsWith('.zta')) {charmap = load_zta(content).sort(function(a,b) {return b.length - a.length})}
  else {return {}}
  charmap = charmap.removeUseless();
  if (complete_ar) {
    return complete_arabic(charmap);
  }
  return charmap;
}

function load_fnt(fntContent) {
  if (fntContent.includes('<?xml version="1.0"?>')) { //Xml
    find = [/<page id="(.*?)" file="(.*?)" \/>/g, /<char id="(.*?)" x="(.*?)" y="(.*?)" width="(.*?)" height="(.*?)" xoffset="(.*?)" yoffset="(.*?)" xadvance="(.*?)" page="(.*?)" chnl="(.*?)" \/>/g];
  }
  else { //Text
    find = [/page id=(.*?) file="(.*?)"/g, /char id=(.*?)[ *?]x=(.*?)[ *?]y=(.*?)[ *?]width=(.*?)[ *?]height=(.*?)[ *?]xoffset=(.*?)[ *?]yoffset=(.*?)[ *?]xadvance=(.*?)[ *?]page=(.*?)[ *?]chnl=(.*?)/g];
  }
  
  const pages = Array.from(fntContent.matchAll(find[0])).map(x => x.slice(1));
  const table = Array.from(fntContent.matchAll(find[1])).map(x => x.slice(1).map(y => parseInt(y)));
  
  var charmap = {tallest: 0, scale: 1, type: "fnt", pages: {}};
  for (const page of pages) {
    charmap.pages[page[0]] = page[1];
  }
  for (const row of table) {
    charmap[String.fromCharCode(row[0])] = {x: row[1], y: row[2], w: row[3], h: row[4], xoff: row[5], yoff: row[6], xadv: row[7], page: row[8], chnl: row[9]};
    if (row[4] > charmap.tallest) {charmap.tallest = row[4]}
  }
  return charmap;
}

function load_aff(affContent) {
  const table = affContent.split(RETURNS.subs().reverse().join('|').toRegex('g')).map(x => x.split(A_SEPARATOR));
  
  var charmap = {tallest: 0, scale: 1, type: "aff", pages: {}};
  for (var r of range(1, table.length)) {
    if (!table[r].length) {continue}
    const drowData = table[r][1].split(AFF_MIN_SEPARATOR);
    
    width = 0;
    for (var slice of drowData) {if (slice.length > width) {width = slice.length}}
    charmap[table[r][0]] = {x: 0, y: 0, w: width, h: drowData.length, xoff: parseInt(table[r][2]), yoff: parseInt(table[r][3]), xadv: parseInt(table[r][4]), drawData: drowData};
    if (drowData.length > charmap.tallest) {charmap.tallest = drowData.length}
  }
  return charmap;
}

// function loadTTF(ttfPath, chars, fontSize) {
  // var charmap = {tallest: 0, scale: 1};
  // dialogue_font = pygame.font.Font(ttfPath, fontSize)
  // for char in freeze(chars):
    // dialogue = dialogue_font.render(char, True, (0,0,0))
    // height = dialogue.get_size()[1]
    // if height > tallest: tallest = height
    // charmap[char] = (0, 0, dialogue.get_size()[0], height, 0, 0, 0)
  // charmap.tallest = tallest
  // return charmap;
// }

function load_act(actContent) {
  const table = actContent.split(RETURNS.subs().reverse().join('|').toRegex('g')).map(x => x.split(A_SEPARATOR));
  var charmap = {};
  for (var r of range(1, table.length)) {charmap[table[r][0]] = table[r].slice(1)}
  return one_one_charmap(charmap.removeUseless());
}

function load_tbl(tblContent) {
  const table = tblContent.split(RETURNS.subs().reverse().join('|').toRegex('g')).map(x => x.splitPlus('=', 1));
  var charmap = {};
  
  for (var row of table) {
    if (!row.length) {continue}
    charmap[row[1]] = row[0].hexDecode();
  }
  
  return charmap;
}

function load_zts(ztsContent) {
  const lines = ztsContent.split(RETURNS.subs().reverse().join('|').toRegex('g'));
  const pairs = zip(lines[0], lines[1]);
  var charmap = {};
  for (var i of range(0, pairs.length)) {charmap[pairs[i][1]] = pairs[i][0]}
  return charmap;
}

function load_zta(ztaContent) {
  for (const r of ztaContent.matchAll(ZTA_RANGE)) {
    const start = parseInt(r[1].charCodeAt(0));
    const steps = parseInt(r[2]);
    var chars = "";
    for (var j of range(start, start+steps)) {
      chars += String.fromCharCode(j);
    }
    ztaContent = ztaContent.replace(r[0], chars);
  }
  return load_zts(ztaContent);
}
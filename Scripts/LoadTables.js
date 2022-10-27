function loadTable(path, content, completearabic=true) {
  var charmap = {};
  // if (filePath.endsWith('.ttf')) {charmap = loadTTF(fileContent, chars, fontSize)}
  if      (path.endsWith('.fnt')) {charmap = loadFNT(content, path)}
  else if (path.endsWith('.aff')) {charmap = loadAFF(content)}
  else if (path.endsWith('.act')) {charmap = loadACT(content)}
  else if (path.endsWith('.tbl')) {charmap = loadTBL(content)}
  else if (path.endsWith('.zts')) {charmap = loadZTS(content)}
  else if (path.endsWith('.zta')) {charmap = loadZTA(content)}
  else {return {}}
  
  if (completearabic) {
      return completeArabic(charmap.removeUseless());
  }
  return charmap.removeUseless();
}

function loadFNT(fntContent, fntPath) {
  if (fntContent.includes('<?xml version="1.0"?>')) { //Xml
    find = [/<page id="(.*?)" file="(.*?)" \/>/g, /<char id="(.*?)" x="(.*?)" y="(.*?)" width="(.*?)" height="(.*?)" xoffset="(.*?)" yoffset="(.*?)" xadvance="(.*?)" page="(.*?)" chnl="(.*?)" \/>/g];
  }
  else { //Text
    find = [/\nchar id=(.*?) x=(.*?) y=(.*?) width=(.*?) height=(.*?) xoffset=(.*?) yoffset=(.*?) xadvance=(.*?) /g];
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

function loadAFF(affContent) {
  const table = affContent.split(Returns.subs().reverse().join('|').toRegex('g')).map(x => x.split(_A_SEPARATOR_));
  
  var charmap = {tallest: 0, scale: 1, type: "aff", pages: {}};
  for (var r of range(1, table.length)) {
    if (!table[r].length) {continue}
    const drowData = table[r][1].split(_AFF_MIN_SEPARATOR);
    
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
  // for char in Freeze(chars):
    // dialogue = dialogue_font.render(char, True, (0,0,0))
    // height = dialogue.get_size()[1]
    // if height > tallest: tallest = height
    // charmap[char] = (0, 0, dialogue.get_size()[0], height, 0, 0, 0)
  // charmap.tallest = tallest
  // return charmap;
// }

function loadACT(actContent) {
  const table = actContent.split(Returns.subs().reverse().join('|').toRegex('g')).map(x => x.split(_A_SEPARATOR_));
  var charmap = {};
  for (var r of range(1, table.length)) {charmap[table[r][0]] = table[r].slice(1)}
  return oneToOneCharmap(charmap.removeUseless());
}

function loadTBL(tblContent) {
  const table = tblContent.split(Returns.subs().reverse().join('|').toRegex('g')).map(x => x.splitPlus('=', 1));
  var charmap = {};
  
  for (var row of table) {
    if (!row.length) {continue}
    charmap[row[1]] = row[0].hexDecode();
  }
  
  return charmap;
}

function loadZTS(ztsContent) {
  const lines = ztsContent.split(Returns.subs().reverse().join('|').toRegex('g'));
  const pairs = zip(lines[0], lines[1]);
  var charmap = {};
  for (var i of range(0, pairs.length)) {charmap[pairs[i][1]] = pairs[i][0]}
  return charmap;
}

function loadZTA(ztaContent) {
  var charmap = {};
  
  while (true) {
    var r = ztaContent.match(_ZTA_RANGE_);
    if (!r) {break}
    const values = r[0].match(/\d+/g);
    const startPoint = parseInt(values[0]);
    const steps = parseInt(values[1]);
    
    var chars = [];
    for (var j of range(startPoint, startPoint+steps)) {chars.push(String.fromCharCode(j))}
    
    ztaContent = ztaContent.replace(_ZTA_RANGE_, chars.join(_ZTA_SEPARATOR_));
  }
  
  const lines = ztaContent.split(Returns.subs().reverse().join('|').toRegex('g'));
  const pairs = zip(lines[0].split(_ZTA_SEPARATOR_), lines[1].split(_ZTA_SEPARATOR_));
  for (var i of range(0, pairs.length)) {charmap[pairs[i][1]] = pairs[i][0]}
  
  return charmap;
}
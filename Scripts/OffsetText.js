function OffsetTextWithSpaces(text, boxwidth, fonttable, offset, linecom, pagecom, commandreg, textoffsetreg) {
  if (Object.keys(fonttable).length < 4) {return text}
  if (fonttable[" "] === undefined) {
    alert('(Space) has no width.');
    return text;
  }
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (commandreg+"|"+textoffsetreg).toRegex("g");
  var newtext = '';
  for (l of range(0, lines.length)) {
    if (l) {newtext += dialogcommands[l-1]}
    
    const freepx = boxwidth - getTextWidth(Freeze(lines[l].replace(commandsregex, "")), fonttable, boxwidth);
    const spacesNum = parseInt(freepx / getTextWidth(" ", fonttable, boxwidth))
    if (spacesNum <= 0) {newtext += lines[l]}
    else if (offset == 0) {newtext += lines[l] + ' '.repeat(spacesNum)}
    else if (offset == 1) {newtext += ' '.repeat(spacesNum) + lines[l]}
    else if (offset == 2) {newtext += ' '.repeat(parseInt(spacesNum / 2)) + lines[l]}
    else if (offset == 3) {newtext += " ".repeat(parseInt(spacesNum / 2)) + lines[l] + ' '.repeat(spacesNum - parseInt(spacesNum / 2))}
  }
  return newtext;
}

function OffsetTextWithCommands(text, boxwidth, fonttable, offset, linecom, pagecom, commandreg, textoffsetreg) {
  if (Object.keys(fonttable).length < 4) {return text}
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (commandreg+"|"+textoffsetreg).toRegex("g");
  var newtext = '';
  
  for (l of range(0, lines.length)) {
    if (l) {newtext += dialogcommands[l-1]}
    
    const freepx = boxwidth - getTextWidth(Freeze(lines[l].replace(commandsregex, "")), fonttable, boxwidth);
    if (offset == 0) {newtext += lines[l] + textoffsetreg.regexToText().replace(".*?", freepx)}
    else if (offset == 1) {newtext += textoffsetreg.regexToText().replace(".*?", freepx) + lines[l]}
    else if (offset == 2) {newtext += textoffsetreg.regexToText().replace(".*?", parseInt(freepx/2)) + lines[l]}
    else if (offset == 3) {newtext += textoffsetreg.regexToText().replace(".*?", parseInt(freepx/2)) + lines[l] + textoffsetreg.regexToText().replace(".*?", freepx - parseInt(freepx/2))}
  }
  return newtext;
}

function OffsetTextWithSpaces(text, boxwidth, fonttable, offset, linecom, pagecom, comform, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {return text}
  if (fonttable[" "] === undefined) {
    alert('(Space) has no width.');
    return text;
  }
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (comform.fixForRegex().replaceAll("<command>", "[\\s\\S]*")+"|"+textoffsetcom.fixForRegex().replaceAll("<px>", "\\d*")).toRegex("g");
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

function OffsetTextWithCommands(text, boxwidth, fonttable, offset, offsetcommand, linecom, pagecom, comform, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {return text}
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (comform.fixForRegex().replaceAll("<command>", "[\\s\\S]*")+"|"+textoffsetcom.fixForRegex().replaceAll("<px>", "\\d*")).toRegex("g");
  var newtext = '';
  
  for (l of range(0, lines.length)) {
    if (l) {newtext += dialogcommands[l-1]}
    
    const freepx = boxwidth - getTextWidth(Freeze(lines[l].replace(commandsregex, "")), fonttable, boxwidth);
    if (offset == 0) {newtext += lines[l] + offsetcommand.replace("<px>", freepx)}
    else if (offset == 1) {newtext += offsetcommand.replace("<px>", freepx) + lines[l]}
    else if (offset == 2) {newtext += offsetcommand.replace("<px>", parseInt(freepx/2)) + lines[l]}
    else if (offset == 3) {newtext += offsetcommand.replace("<px>", parseInt(freepx/2)) + lines[l] + offsetcommand.replace("<px>", freepx - parseInt(freepx/2))}
  }
  return newtext;
}

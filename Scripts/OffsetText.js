function OffsetTextWithSpaces(text, boxwidth, fonttable, offset, linecom, pagecom, commandreg, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {return text}
  if (fonttable[" "] === undefined) {
    alert('(Space) has no width.');
    return text;
  }
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
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

function OffsetTextWithCommands(text, boxwidth, fonttable, offset, linecom, pagecom, commandreg, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {return text}
  const dialogRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()).toRegex("g");
  const lines = text.split(dialogRegex).filter(element => element != undefined);
  const dialogcommands = text.match(dialogRegex);
  const commandsregex = (commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
  var newtext = '';
  
  for (l of range(0, lines.length)) {
    if (l) {newtext += dialogcommands[l-1];}
    var freepx = boxwidth - getTextWidth(Freeze(lines[l].replace(commandsregex, "")), fonttable, boxwidth);
	[...lines[l].matchAll(textoffsetcom.fixForRegex().replace("<px>", "(.*?)").toRegex("g"))].map(x => freepx -= parseFloat(x[1]))
	
    if (offset == 0) {newtext += lines[l] + textoffsetcom.replace("<px>", freepx)}
    else if (offset == 1) {newtext += textoffsetcom.replace("<px>", freepx) + lines[l]}
    else if (offset == 2) {newtext += textoffsetcom.replace("<px>", parseInt(freepx/2)) + lines[l]}
    else if (offset == 3) {newtext += textoffsetcom.replace("<px>", parseInt(freepx/2)) + lines[l] + textoffsetcom.replace("<px>", freepx - parseInt(freepx/2))}
  }
  return newtext;
}

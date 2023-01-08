function checkChar(char, fonttable, boxwidth) {
  if (!(char in fonttable) || ((fonttable[char].w + fonttable[char].xadv) * fonttable.scale > boxwidth)) {
    return false
  }
  return true;
}

function getTextWidth(text, fonttable, boxwidth) {
  var width = 0;
  for (char of text) {
    if (!checkChar(char, fonttable, boxwidth)) {continue}
    width += fonttable[char].w + fonttable[char].xadv;
  }
  return width * fonttable.scale
}

function FitTextInBox(text, fonttable, boxsize, pxbetweenlines, linecom, pagecom, commandreg, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {
    return text
  }
  if (fonttable.fontsize > boxsize[1]) {
    return ""
  }
  
  // for (const i of NotLastInLine) {
    // text = text.replaceAll((' '+i+'[\r,\n, ]').toRegex('g'), ' '+i+'§');
  // }
  
  const commandsRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()+"|"+commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
  const textoffsetreg = textoffsetcom.fixForRegex().replace("<px>", "(.*?)").toRegex();
  const textlist = text.split(commandsRegex).filter(element => element != undefined);
  const commands = text.match(commandsRegex);
  var newtext = '', x = 0, y = 0;

  for (p of range(0, textlist.length)) {
    if (p) {
      const com = commands[p - 1];
      if (com == linecom) {
        x = 0;
        y += fonttable.fontsize + pxbetweenlines;
        if (y + fonttable.fontsize > boxsize[1]) {y = 0;}
        newtext += com;
      }
      else if (com == pagecom) {
        x = 0, y = 0;
        newtext += pagecom;
      }
      else if (textoffsetreg.test(com)) {
        x += parseFloat(com.match(/\d+/));
        newtext += com;
      }
	  else {
	    newtext += com;
      }
    }
    for (var word of textlist[p].split(' ')) {
      word = (!(x+p) ? '' : ' ') + word
      const wordwidth = getTextWidth(word, fonttable, boxsize[0]);
      if (wordwidth > boxsize[0]) {
        if (x) {
          word = word.slice(1)
          y += fonttable.fontsize + pxbetweenlines;
          if (y + fonttable.fontsize > boxsize[1]) {
            y = 0
          }
          newtext += (!y ? pagecom : linecom);
        }
        x = 0;
        for (var char of Freeze(word)) {
          const charwidth = getTextWidth(char, fonttable, boxsize[0]);
          if (x + charwidth > boxsize[0]) {
            x = 0;
            y += fonttable.fontsize + pxbetweenlines;
            if (y + fonttable.fontsize > boxsize[1]) {y = 0;}
            newtext += (!y ? pagecom : linecom);
          }
          newtext += char;
          x += charwidth;
        }
      }
      else if (x + wordwidth > boxsize[0]) {
        x = wordwidth
		if (p) {x -= getTextWidth(' ', fonttable, boxsize[0]);}
        y += fonttable.fontsize + pxbetweenlines;
        if (y + fonttable.fontsize > boxsize[1]) {y = 0;}
        newtext += (!y ? pagecom : linecom) + word.slice(1);
      }
      else {
        newtext += word;
        x += wordwidth
      }
    }
  }
  return newtext;//.replaceAll('§', ' ');
}
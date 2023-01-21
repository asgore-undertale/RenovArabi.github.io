function check_char(char, fonttable, boxwidth) {
  if (!(char in fonttable) || ((fonttable[char].w + fonttable[char].xadv) * fonttable.scale > boxwidth)) {
    return false
  }
  return true;
}

function get_text_width(text, fonttable, boxwidth) {
  var width = 0;
  for (char of text) {
    if (!check_char(char, fonttable, boxwidth)) {continue}
    width += fonttable[char].w + fonttable[char].xadv;
  }
  return width * fonttable.scale
}

function fit_text_in_box(text, fonttable, boxsize, pxbetweenlines, linecom, pagecom, commandreg, textoffsetcom) {
  if (Object.keys(fonttable).length < 4) {
    return text
  }
  if (fonttable.fontsize > boxsize[1]) {
    return ""
  }
  
  // for (const i of NOT_LAST_IN_LINE) {
    // text = text.replaceAll((' '+i+'[\r,\n, ]').toRegex('g'), ' '+i+'§');
  // }
  
  const commandsRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()+"|"+commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
  const textoffsetreg = textoffsetcom.fixForRegex().replace("<px>", "(.*?)").toRegex();
  const textlist = text.split(commandsRegex).filter(element => element != undefined);
  const commands = text.match(commandsRegex);
  var newtext = '', x = 0, y = 0;
  
  for (const p of range(0, textlist.length)) {
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
	var words = textlist[p].split(' ');
    for (const w of range(0, words.length)) {
      var word = ((x && w)? ' ' : '') + words[w];
      const wordwidth = get_text_width(word, fonttable, boxsize[0]);
      if (wordwidth > boxsize[0]) {
        if (x) {
          word = word.slice(1)
          y += fonttable.fontsize + pxbetweenlines;
          if (y + fonttable.fontsize > boxsize[1]) {
            y = 0
          }
          newtext += (y ? linecom : pagecom);
        }
        x = 0;
        for (var char of freeze(word)) {
          const charwidth = get_text_width(char, fonttable, boxsize[0]);
          if (x + charwidth > boxsize[0]) {
            x = 0;
            y += fonttable.fontsize + pxbetweenlines;
            if (y + fonttable.fontsize > boxsize[1]) {y = 0;}
            newtext += (y ? linecom : pagecom);
          }
          newtext += char;
          x += charwidth;
        }
      }
      else if (x + wordwidth > boxsize[0]) {
        x = wordwidth - get_text_width(' ', fonttable, boxsize[0]);
        y += fonttable.fontsize + pxbetweenlines;
        if (y + fonttable.fontsize > boxsize[1]) {y = 0;}
        newtext += (y ? linecom : pagecom) + word.slice(1);
      }
      else {
        newtext += word;
        x += wordwidth
      }
    }
  }
  return newtext;//.replaceAll('§', ' ');
}
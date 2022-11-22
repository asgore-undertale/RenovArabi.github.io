var ciphertable = {},
  fonttable = {},
  fontimgs = {},
  displayedPageIndex = 0,
  translatedFile;

/*function getTextTtfWidth(text, font) {
var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
var context = canvas.getContext("2d");
context.font = font;
var metrics = context.measureText(text);
return metrics.width;
}
var w = getTextTtfWidth("Hello world!", "12px Arial");
console.log(w)*/

function enteringTextFunc() {
  getById('enteredcharsnum').innerText = getById('enteredtext').value.length;
}

function resultingTextFunc() {
  getById('resultcharsnum').innerText = getById('resultedtext').value.length;
}

function convertText(text) {
  const inbytercom = getById("inbytercom").value;
  const outbytecom = getById("outbytecom").value;
  const textoffsetcom = getById("textoffsetcom").value;
  const commandreg = getById("commandreg").value;
  const linecom = getById("linecom").value;
  const pagecom = getById("pagecom").value;
  const defaultchiperchar = getById("defaultchiperchar").value;
  const harakatoffsetvalue = parseInt(getById("harakatoffsetvalue").value);
  const dtesnum = parseInt(getById("dtesnum").value);
  const dteslen = getById("dteslen").value.split(',').map(x => parseInt(x));
  const ignoreddtes = getById("ignoreddtes").value;
  const boxsize = getById("boxsize").value.split(',').map(x => parseInt(x));
  const pxbetweenlines = parseInt(getById("pxbetweenlines").value);
  const extractreg = getById("extractreg").value;
  const extractedlength = getById("extractedlength").value.split(',').map(x => parseInt(x));
  var _ciphertable = {};
  var _fonttable = {};
  if (getById("chipertablecheck").checked) {
    _ciphertable = ciphertable
  }
  if (getById("fonttablecheck").checked) {
    updatefontsize();
    _fonttable = fonttable
  }
    
  const commandsRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()+"|"+commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
  const textlist = text.split(commandsRegex).filter(element => element != undefined);
  const commands = text.match(commandsRegex);
  var newtext = '';
  for (p of range(0, textlist.length)) {
    var part = textlist[p];
    if (p) {
      newtext += commands[p - 1]
    }
    if (!part.length) {
      continue
    }
    if (getById("extract").checked) {
      part = ExtractFromText(part, extractreg, extractedlength).join("\n")
    }
    if (getById("convertfrom").selectedIndex) {
      part = HexToText(part, inbytercom)
    }
    if (getById("delharakat").checked) {
      part = DelHarakat(part)
    } else {
      if (getById("mergeharakat").checked) {
        part = MergeHarakat(part)
      }
      if (getById("offsetharakat").checked) {
        part = MoveHaraka(part, harakatoffsetvalue)
      }
      if (getById("keepfirstharakat").checked) {
        part = KeepFirstHaraka(part)
      }
      if (getById("connectharakat").checked) {
        part = ConnectHarakat(part)
      }
    }
    if (getById("freeze").checked || getById("cipher").checked || getById("compress").checked) {
      part = Freeze(part)
    }
    if (getById("compress").checked) {
      part = CompressText(part, dteslen, dtesnum, ignoreddtes)
    }
    if (getById("reverseall").checked) {
      part = ReverseAll(part)
    }
    if (getById("reversearabi").checked) {
      part = ReverseArabic(part)
    }
    if (getById("cipher").checked) {
      part = Cipher(part, _ciphertable, defaultchiperchar, false, getById('notinchipertable').selectedIndex)
    }
    if (getById("uncipher").checked) {
      part = Cipher(part, _ciphertable, defaultchiperchar, true, getById('notinchipertable').selectedIndex)
    }
    if (getById("uncompress").checked) {
      part = UncompressText(part)
    }
    if (getById("unfreeze").checked) { // || getById("uncipher").checked || getById("uncompress").checked
      part = UnFreeze(part)
    }
    if (getById("convertto").selectedIndex) {
      part = TextToHex(part, outbytecom)
    }
    newtext += part;
  }
  if (getById("putinbox").checked) {
    newtext = FitTextInBox(newtext, _fonttable, boxsize, pxbetweenlines, linecom, pagecom, commandreg, textoffsetcom)
  }
  if (getById("offset").selectedIndex) {
    if (getById("offsetwith").selectedIndex) {
      newtext = OffsetTextWithCommands(newtext, boxsize[0], _fonttable, getById("offset").selectedIndex - 1, linecom, pagecom, commandreg, textoffsetcom)
    } else {
      newtext = OffsetTextWithSpaces(newtext, boxsize[0], _fonttable, getById("offset").selectedIndex - 1, linecom, pagecom, commandreg, textoffsetcom)
    }
  }
  if (getById('autocopy').checked) {
    newtext.copyToClipboard()
  }
  return newtext;
}

function drawText(text) {
  const DialogBox = getById('dialogbox');
  const ctx = DialogBox.getContext('2d');
  const boxsize = getById("boxsize").value.split(',').map(x => parseInt(x));
  const pxbetweenlines = parseInt(getById("pxbetweenlines").value);
  const textoffsetcom = getById("textoffsetcom").value;
  const commandreg = getById("commandreg").value;
  const linecom = getById("linecom").value;
  const pagecom = getById("pagecom").value;
  DialogBox.width = boxsize[0];
  DialogBox.height = boxsize[1];
  var _fonttable = {};
  if (getById("fonttablecheck").checked) {
    updatefontsize();
    _fonttable = fonttable
  }
  if (!Object.keys(_fonttable).length) {
    return text
  }
  updatefontsize()
  if (_fonttable.fontsize > boxsize[1]) {
    return ""
  }

  const commandsRegex = (linecom.fixForRegex()+"|"+pagecom.fixForRegex()+"|"+commandreg+"|"+textoffsetcom.fixForRegex().replace("<px>", ".*?")).toRegex("g");
  const textoffsetreg = textoffsetcom.fixForRegex().replace("<px>", "(.*?)").toRegex();
  const pagescount = (text.match(pagecom.fixForRegex().toRegex("g")) || []).length;
  const page = (text.split(pagecom)).at(displayedPageIndex % (pagescount + 1));
  const textlist = Freeze(page).split(commandsRegex).filter(element => element != undefined);
  const commands = page.match(commandsRegex);
  var x = 0,
    y = 0;
  for (p of range(0, textlist.length)) {
    const part = textlist[p];
    if (p) {
      const com = commands[p - 1];
      if (com == linecom) {
        x = 0
        y += _fonttable.fontsize + pxbetweenlines;
        if (y + _fonttable.fontsize > boxsize[1]) {
          y = 0
        }
      } else if (com == pagecom) {
        x = 0, y = 0
      }
      else if (textoffsetreg.test(com)) {
        x += parseFloat(com.match(/\d+/));
      }
    }
    for (char of part) {
      if (!(char in _fonttable)) {
        continue
      }
      const chardata = _fonttable[char];
      const X = ((DialogBox.width - x + (chardata.xoff - chardata.w) * fonttable.scale) * getById('rtl').checked) + ((x + chardata.xoff * fonttable.scale) * !getById('rtl').checked);
      const Y = y + chardata.yoff * _fonttable.scale;
      if (_fonttable.type == "aff") {
        for (i of range(0, chardata.drawData.length)) {
          for (j of range(0, chardata.drawData[i].length)) {
            if (chardata.drawData[i][j] == " ") {
              continue
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fillRect(X + j * _fonttable.scale, Y + i * _fonttable.scale, _fonttable.scale, _fonttable.scale)
          }
        }
      } else {
        ctx.drawImage(fontimgs[_fonttable.pages[chardata.page]], chardata.x, chardata.y, chardata.w, chardata.h, X, Y, chardata.w * _fonttable.scale, chardata.h * _fonttable.scale);
      }
      x += (chardata.w + chardata.xadv) * _fonttable.scale;
    }
  }
}

async function loadciphertable(file) {
  ciphertable = await loadTable(file);
  console.log(ciphertable);
}

async function loadfonttable(file) {
  fonttable = await loadTable(file);
  console.log(fonttable);
}

async function loadfontimages(files) {
  fontimgs = {};
  for (file of files) {
    fontimgs[file.name] = await loadImage(file);
  }
}

function updatefontsize() {
  const fontsize = parseInt(getById("fontsize").value);
  fonttable.fontsize = fontsize;
  fonttable.scale = fontsize / fonttable.tallest;
}

async function loadTextFile(file) {
  getById('enteredtext').value = await readFile(file);
}

function createCTE() {
  var cipheringTableEditor = CreateHTMLTable(17, 17);
  const a = "0123456789ABCDEF"
  for (var i of range(0, a.length)) {
    cipheringTableEditor.rows.item(i+1).cells.item(0).innerHTML = `<b>${a[i]}0</b>`;
    cipheringTableEditor.rows.item(i+1).cells.item(0).contentEditable = "false";
    cipheringTableEditor.rows.item(0).cells.item(i+1).innerHTML = `<b>${a[i]}</b>`;
    cipheringTableEditor.rows.item(0).cells.item(i+1).contentEditable = "false";
  }
  cipheringTableEditor.rows.item(0).cells.item(0).contentEditable = "false";
  // cipheringTableEditor = fillCTE(cipheringTableEditor);
  return cipheringTableEditor;
}

function fillCTE(table) { // CipheringTableEditor
  for (var i of range(0, 16)) {
    for (var j of range(0, 16)) {
      //table.rows.item(i+1).cells.item(j+1).innerText = (table.rows.item(0).cells.item(0).innerText + ((i)*16 + (j)).toString(16)).hexDecode();
    }
  }
  return table;
}

async function loadTableForCTE(file) {
  const table = await loadTable(file, false);
  cipheringTableEditor = clearHTMLtable(cipheringTableEditor, {
    x: 1,
    y: 1
  });
  for ([k, v] of Object.entries(table)) {
    if (!v.length) {
      continue
    }
    const hex = ReverseAll(v).hexEncode();
    const header = hex.slice(0, -2);
    const x = parseInt(hex.slice(-2, -1), 16);
    const y = parseInt(hex.slice(-1), 16);
    cipheringTableEditor.rows.item(x + 1).cells.item(y + 1).innerText = k;
  }
}

function getCharmapFromCTE() {
  const header = "00";
  var charmap = {};
  for (var r of range(1, cipheringTableEditor.rows.length)) {
    for (var c of range(1, cipheringTableEditor.rows.item(r).cells.length)) {
      const k = cipheringTableEditor.rows.item(r).cells.item(c).innerText;
      const v = (header + (r - 1).toString(16) + (c - 1).toString(16)).hexDecode();
      if (!k.length) {
        continue
      }
      if (k == v) {
        continue
      }
      charmap[k] = v;
    }
  }
  return charmap;
}

function printSuggestedDTEs() {
  const text = Freeze(getById('enteredtext').value);
  const dteLengths = getById("dteslen").value.split(',').map(x => parseInt(x));
  const resultsNum = parseInt(getById("dtesnum").value);
  prompt("الاختزالات من الأكثر وروداً للأقل:", "(" + SuggestDTE(text, dteLengths, resultsNum).join(") (") + ")");
}

function createTTE(row = 1, col = 3) { //TranslatingTableEditor
  var fileTranslatorTable = CreateHTMLTable(row, col);
  fileTranslatorTable.rows.item(0).cells.item(0).innerHTML = "<b>رقم</b>";
  fileTranslatorTable.rows.item(0).cells.item(0).contentEditable = "false";
  fileTranslatorTable.rows.item(0).cells.item(0).style.width = '70px';
  fileTranslatorTable.rows.item(0).cells.item(1).innerHTML = "<b>الأصلي</b>";
  fileTranslatorTable.rows.item(0).cells.item(1).contentEditable = "false";
  fileTranslatorTable.rows.item(0).cells.item(2).innerHTML = "<b>الترجمة</b>";
  fileTranslatorTable.rows.item(0).cells.item(2).contentEditable = "false";
  for (i of range(1, row)) {
    fileTranslatorTable.rows.item(i).cells.item(0).innerHTML = `<b>${i}</b>`;
    fileTranslatorTable.rows.item(i).cells.item(0).contentEditable = "false";
  }
  return fileTranslatorTable;
}

async function loadFileToTTE(file) {
  translatedFile = file;
  fileContent = await readFile(file);
  const textList = fileContent.match(getById("oritextreg").value.toRegex("g"));
  const transList = fileContent.match(getById("transtextreg").value.toRegex("g"));
  try {getById("filetranslator").removeChild(fileTranslatorTable)}
  catch(err) {document.innerHTML = err.message}
  fileTranslatorTable = createTTE(max(textList.length, transList.length) + 1);
  for (t of range(0, max(textList.length, transList.length))) {
    fileTranslatorTable.rows.item(t + 1).cells.item(1).innerHTML = textList[t] || "";
    fileTranslatorTable.rows.item(t + 1).cells.item(2).innerHTML = transList[t] || "";
  }
  getById("filetranslator").appendChild(fileTranslatorTable);
}

async function saveTranslatedFile() {
  var content = await readFile(translatedFile);
  for (r of range(1, fileTranslatorTable.rows.length - 1)) {
    content = content.replace(fileTranslatorTable.rows.item(r).cells.item(0).innerHTML.fixForRegex(), fileTranslatorTable.rows.item(r).cells.item(1).innerHTML);
  }
  content.downloadAsFile(translatedFile.name);
}
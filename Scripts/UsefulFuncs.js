function range(start, end, step=1) {
  var l = [];
  if (step > 0) {
    for (var i=start; i<end; i+=step) {l.push(i)}
  }
  else if (step < 0) {
    for (var i=start; i>end; i+=step) {l.push(i)}
  }
  return l;
}

function zip() {
  var args = [].slice.call(arguments);
  var shortest = args.length==0 ? [] : args.reduce(function(a,b){
    return a.length<b.length ? (typeof a == 'string' ? a.split('') : a) : (typeof b == 'string' ? b.split('') : b)
  });
  return shortest.map(function(_,i){
    return args.map(function(array){return array[i]})
  });
}

function readCsv(csvContent) {
  var csvtable = [];
  var row = [];
  var content = '';
  var mode = true;
  
  for (var c of range(0, csvContent.length)) {
    if (csvContent[c]+csvContent[c+1] == CSV_QUOTECHAR.repeat(2) && !mode) {content += CSV_QUOTECHAR}
    if (csvContent[c] == CSV_QUOTECHAR) {mode = !mode; continue}
    if (csvContent[c] == CSV_QUOTECHAR && (csvContent[c+1] == CSV_DELIMITER || RETURNS.includes(csvContent[c]) || !csvContent[c+1]) && !mode) {mode = true; continue}
    if (csvContent[c] == CSV_DELIMITER && mode) {row.push(content); content = ''; continue}
    if (RETURNS.includes(csvContent[c]) && mode) {row.push(content); content = ''; csvtable.push(row); row = []; continue}
    content += csvContent[c];
  }
  row.push(content);
  csvtable.push(row);
  return csvtable;
}

async function readFile(file) {
  const reader = new FileReader();
  reader.readAsText(file);
  const result = await new Promise((resolve, reject) => {
    reader.onload = function(event) {resolve(reader.result)}
  })
  return result
}

async function loadImage(file) {
  if (file === undefined) {return}
  let reader = new FileReader();
  reader.readAsDataURL(file)
  const result = await new Promise((resolve, reject) => {
    reader.onload = function(event) {
    let img = document.createElement('img');
    img.onload = () => {resolve(img)}
    img.src = event.target.result;
    }
  })
  return result;
}

function getById(id) {
  return document.getElementById(id);
}

function openTab(evt, tabname) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
}

function CreateHTMLTable(row, col) {
  let tbl = document.createElement('table');
  for(let i = 0; i < row; i++) {
    let tr = tbl.insertRow();
    for(let j = 0; j < col; j++) {
      let td = tr.insertCell();
      td.contentEditable = "true";
    }
  }
  return tbl
}

function clearHTMLtable(table, startpoint) {
  for (var r of range(startpoint.y, table.rows.length)) {
    for (var c of range(startpoint.x, table.rows.item(r).cells.length)) {
      table.rows.item(r).cells.item(c).innerText = "";
    }
  }
  return table
}

// class HTML3DTable {
  // constructor(row, col, lay) {
    // this.layers = document.createElement('div');
	// this.index = 0;
	
    // this.cell = document.createElement('textarea');
	// this.cell.class = "cell";
	// this.cell.oninput = "showLay(parseInt(this.value));";
    // this.layers.appendChild(this.cell);
	
    // for (const i of range(0, lay)) {
	  // var tbl = CreateHTMLTable(row, col);
	  // tbl.style.display = "none";
      // this.layers.appendChild(tbl);
	// }
  // }
  
  // showLay(i = 0) {
    // this.layers.childNodes.item(this.index+1).display = "none";
    // this.layers.childNodes.item(i+1).display = "block";
	// this.index = i;
  // }
// }

function min(a, b) {
  return a > b? b : a;
}

function max(a, b) {
  return a > b? a : b;
}

Object.prototype.swapKeysAndValues = function() {
  var obj = {};
  for ([key, value] of Object.entries(this)) {if (!(value in obj)) {obj[value] = key}}
  return obj;
  // return Object.assign({}, ...Object.entries(this).map(([a,b]) => ({ [b]: a })))
}

Object.prototype.removeEmptyStringKeys = function() {
  delete this[''];
  return this;
}

Object.prototype.removeUndefinedKeys = function() {
  delete this[undefined];
  return this;
}

Object.prototype.removeUndefinedValues = function() {
  Object.keys(this).forEach(key => {
    if (this[key] === undefined) {delete this[key]}
  });
  return this;
}

Object.prototype.removeUseless = function() {
  return this.removeEmptyStringKeys().removeUndefinedKeys().removeUndefinedValues();
}

Object.prototype.sort = function(func) {
  var keys = Object.keys(this);
  keys.sort(func);
  var obj = {};
  for (k of keys) {obj[k] = this[k]}
  return obj;
}

Array.prototype.replaceItems = function(olditem, newitem) {
  if (olditem != newitem) {i = this.indexOf(olditem);
    while (i >= 0) {this[i]=newitem; i = this.indexOf(olditem)}
  }
  return this
}

Array.prototype.count = function(item) {
  return this.filter(x => x === i).length;
}

Array.prototype.removeDublicatedItems = function() {
  return  [...new Set(this)];
}

String.prototype.startsWith = function(preffix) {
  return this.indexOf(preffix, 0) !== -1;
}

String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

String.prototype.hexEncode = function(bytelen=2) {
  var result = "";
  for (var i of range(0, this.length)) {
    hex = this.charCodeAt(i).toString(16);
    result += ("0"+"00".repeat(bytelen-1)+hex).slice(-bytelen*2);
  }
  return result
}

String.prototype.hexDecode = function(bytelen=2) {
  var hexes = this.match(`.{1,${bytelen*2}}`.toRegex('g')) || [];
  var back = "";
  for (var i of range(0, hexes.length)) {back += String.fromCharCode(parseInt(hexes[i], 16))}
  return back;
}

String.prototype.splitPlus = function(splitter, num =- 1) {
  const list = this.split(splitter);
  if (num < 0) {return list}
  var list2 = [];
  for (var i of range(0, num)) {list2.push(list[i])}
  list2.push(list.slice(num).join(splitter));
  return list2;
}

String.prototype.subs = function(sublen=0) {
  var l = [];
  if (sublen>0) {
    for (j of range(0, this.length-sublen+1)) {l.push(this.slice(j, j+sublen))}
    return l;
  }
  for (sublen of range(this.length, 0, -1)) {
    for (j of range(0, this.length-sublen+1)) {l.push(this.slice(j, j+sublen))}
  }
  return l;
}

String.prototype.fixForRegex = function() {
  return this.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

String.prototype.toRegex = function(modifier = '') { //modifier: gmiu...
  return new RegExp(this, modifier);
}

String.prototype.copyToClipboard = function() {
  const el = document.createElement('textarea');
  const active = document.activeElement;
  el.textContent = this;
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand('copy');
  active.focus();
  document.body.removeChild(el);
}

String.prototype.insert = function(string, index) {
  return this.substring(0, index) + string + this.substr(index);
}

String.prototype.count = function(str) {
  return (this.match(str.fixForRegex().toRegex("g"))||[]).length;
}

String.prototype.returnInPath = function(steps) {
  return this.split(/[/,\\]/g).slice(-steps).join("/");
}

String.prototype.downloadAsFile = function(name) {
  var a = document.createElement('a');
  a.setAttribute('href', `data:text/${name.split(".").pop()};charset=utf-8,`+encodeURI(this));
  a.setAttribute('download', name);
  a.click();
}

const delay = ms => new Promise(res => setTimeout(res, ms)); //async await

/*
String.fromCharCode(2000))
'ﺃ'.charCodeAt(0)

var a = { fruit: "apple" },
    b = { vegetable: "carrot" },
    food = Object.assign({}, a, b);
*/

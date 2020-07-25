const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const assets = path.join(__dirname, "public");

// Set template engine
app.set('view engine', 'pug');
//Set directory of templates
app.set("views", path.join(__dirname, "views"));

// Set asset folder to `public` folder
app.use(express.static(assets));

// Listen on server
app.listen(8000, () => {
  console.log('Server listening on 8000');
});

// Get file list of SVG
function fileList(dir) {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

// Array of folders
const FD = ['apps', 'brands', 'devices', 'fashion', 'files', 'media', 'misc', 'social', 'weather'];

// Define all necessary arrays
let all = [],
  sorted = [],
  noDir = [];

// List all file names in DIR
FD.forEach(function (a) {
  all.push(fileList('./public/assets/svg/' + a).map((file) => a + '/' + file.split(path.sep).slice(-1)[0]));
  noDir.push(fileList('./public/assets/svg/' + a).map((file) => file.split(path.sep).slice(-1)[0]));
});

// Enable deep level flatten use recursion with reduce and concat
function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
    arr.slice();
}

// Flatten all arrays
all = all.flat(2);
noDir = noDir.flat(2).sort();

noDir.forEach(function (a) {
  all.forEach(function (b, i) {
    if (b.match(a)) sorted.push(all[i]);
  });
});

// Register index page
app.get('/', (req, res) => {
  res.render('index', {
    // Pass SVG array to Pug for processing
    allSvg: sorted
  });
});
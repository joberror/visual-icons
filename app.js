const express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs'),
  sassMiddleware = require('node-sass-middleware'),
  assets = path.join(__dirname, "src/assets/");

// Set template engine
app.set('view engine', 'pug');
//Set directory of templates
app.set("views", path.join(__dirname, "src/views"));

app.use(sassMiddleware({
  /* Options */
  src: path.join(assets, 'styles'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/styles' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// Set asset folder to `public` folder
app.use(express.static(assets));

// Listen on server
app.listen(3000, () => {
  console.log('Server listening on 3000');
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
let allFiles = ['apps', 'brands', 'browser', 'business', 'devices', 'editor', 'fashion', 'files', 'geo', 'media', 'music', 'navigation', 'picture', 'player', 'social', 'tools', 'video'],
  total = [],
  svgDir = [];

// Get total files
allFiles.forEach((a) => {
  total.push(fileList('./pack/' + a + '/svg/').length);
  svgDir.push(fileList('./src/assets/svg/' + a).map((file) => a + '/' + file.split(path.sep).slice(-1)[0]));
});

// List all file names in DIR >5

// FD.forEach(function (a) {
//   all.push(fileList('./public/assets/svg/' + a).map((file) => a + '/' + file.split(path.sep).slice(-1)[0]));
//   noDir.push(fileList('./public/assets/svg/' + a).map((file) => file.split(path.sep).slice(-1)[0]));
// });

// Enable deep level flatten use recursion with reduce and concat
// function flatDeep(arr, d = 1) {
//   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
//     arr.slice();
// }

// Flatten all arrays
// all = all.flat(2);
// noDir = noDir.flat(2).sort();

// noDir.forEach(function (a) {
//   all.forEach(function (b, i) {
//     if (b.match(a)) sorted.push(all[i]);
//   });
// });

// Register index page
app.get('/', (req, res) => {
  res.render('index', {
    // Pass SVG array to Pug for processing
    allSvg: svgDir,
    allTotal: total,
    allDir: allFiles
  });
});

//console.log(total[14]);

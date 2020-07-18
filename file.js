const fs = require('fs');
const path = require('path');
const util = require('util');

// String -> [String]
function fileList(dir) {
  return fs.readdirSync(dir).reduce(function (list, file) {
    var name = path.join(dir, file);
    var isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

// Array of folders
const FD = ['apps', 'brands', 'devices', 'fashion', 'files', 'media', 'misc', 'social', 'weather'];
let all = [];
let noDir = [];
let sorted = [];

// 2. List all file names in DIR
FD.forEach(function (a) {
  all.push(fileList('./assets/svg/' + a).map((file) => a + '/' + file.split(path.sep).slice(-1)[0]));
  noDir.push(fileList('./assets/svg/' + a).map((file) => file.split(path.sep).slice(-1)[0]));
});

// to enable deep level flatten use recursion with reduce and concat
function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
    arr.slice();
}
// fs.writeFile('svg.txt', flatDeep(all, 2), function (err) {
//   if (err) return console.log(err);
//   console.log('done');
// });

// console.log(util.inspect(flatDeep(all, 2), {
//   showHidden: true,
//   depth: null,
//   maxArrayLength: null
// }));
all = all.flat(2);
noDir = noDir.flat(2).sort();

noDir.forEach(function (a) {
  all.forEach(function (b, i) {
    if (b.match(a)) sorted.push(all[i]);
  });
});

console.log(sorted, sorted.length);
const fs = require('fs');
const path = require('path');

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

// 2. List all file names in DIR
FD.forEach(function (a) {
  console.log(fileList('./assets/svg/' + a).map((file) => file.split(path.sep).slice(-1)[0]));
  // => ['babel', 'bower', ...]
});

const fs = require('fs');
const path = require('path');
const util = require('util');

const folders = fs.readdirSync('./src/assets/svgs/');
const files = fs.readdirSync('./src/assets/svgs/editor/');
console.log(files);
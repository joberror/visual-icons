//---------- Requirements, modules, plugins ------------------------------------------

const
  express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs'),
  sass = require('sass'),
  compression = require('compression'),
  electricity = require('electricity'),
  assets = path.join(__dirname, "src/assets/"),
  views = path.join(__dirname, "src/views"),
  router = express.Router(),

  // Custom  node_modules

  // Electricity options
  options = {
    hashify: false,
    headers: {},
    hostname: '',
    sass: {},
    snockets: {},
    uglifyjs: {
      enabled: true,
      compress: {
        sequences: true
      }
    },
    uglifycss: {
      enabled: true
    }
  };

// --------- Configs and defaults -----------------------------------------------------

// Use Gzip compression
app.use(compression());

// Set template engine
app.set('view engine', 'pug');
// Set directory of templates
app.set("views", views);

// Set asset folder to `public` folder
app.use(electricity.static(assets, options));

// Listen on server
app.listen(4000, () => {
  console.log('Server listening on 4000');
});

// -------------- Runtime and processing -----------------------------------------------

// Set defaults
let
  // main svg source
  source = './src/assets/svgs/',
  // sample svg source
  source_ex = './src/assets/svg-sample',
  // get all svg category from source folder
  svg_cat = fs.readdirSync(source),
  // total svg per category in array
  total_per_cat = [],
  // all svg file
  svg_all = [],
  // all sample svg file
  svg_ex = [],
  // total svg
  total_svg;

// Source for all svg file and put it in array
svg_cat.forEach((cat) => {
  svg_all.push(
    fs.readdirSync(source + cat).map(
      (file) => cat + '/' + file.split(path.sep).slice(-1)[0]
    )
  );
});

// Source for sample svg file
svg_ex.push(
  fs.readdirSync(source_ex).map(
    (file) => file.split(path.sep).slice(-1)[0]
  )
);

// Get the total of all svg per category
svg_all.forEach((arr) => {
  total_per_cat.push(arr.length);
});

// Get the total of all svg files
total_svg = total_per_cat.reduce((a, b) => {
  return +a + +b;
});

// Initialize custom module

// --------------- Debugging and test ------------------------------------------------

// console.log(total_svg);

// --------------- Page, routing and navigation --------------------------------------

// Register Home page
router.get('/', (req, res) => {
  res.render('', {
    // Pass SVG array to Pug for processing
    svgSample: svg_ex,
    catSvg: svg_all,
    catTotal: total_per_cat,
    catName: svg_cat,
    svgTotal: total_svg
  });
});

app.use('/', router);
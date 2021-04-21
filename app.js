//---------- Requirements, modules, plugins ------------------------------------------

const
  express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs'),
  sassMiddleware = require('node-sass-middleware'),
  assets = path.join(__dirname, "src/assets/"),
  views = path.join(__dirname, "src/views"),
  router = express.Router();

// --------- Configs and defaults -----------------------------------------------------

// Set template engine
app.set('view engine', 'pug');
// Set directory of templates
app.set("views", views);
// Sass Middleware
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
  svg_ex = [];

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

// --------------- Debugging and test ------------------------------------------------

console.log(svg_all);

// --------------- Page, routing and navigation --------------------------------------

// Register Home page
router.get('/', (req, res) => {
  res.render('', {
    // Pass SVG array to Pug for processing
    svgSample: svg_ex
  });
});

// Register View page
router.get('/viewer', (req, res) => {
  res.render('viewer', {
    // Pass SVG array to Pug for processing
    catSvg: svg_all,
    catTotal: total_per_cat,
    catName: svg_cat
  });
});

// Register Feature page
router.get('/features', (req, res) => {
  res.render('features', {});
});

app.use('/', router);
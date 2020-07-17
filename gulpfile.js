'use strict';

//Load required node modules
const Fiber = require('fibers');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

//Sass compiler
plugins.sass.compiler = require('sass');

// Minify Scripts using Terser toplevel,drop_console=true,sequences=false,ecma=6.
// Minified script saved as .min suffix file name.
let minifyJS = () =>
	gulp.src('dist/main.js')
	.pipe(plugins.terserJs({
		compress: {
			toplevel: true,
			ecma: 6,
			// drop_console: true,
			sequences: false
		}
	}))
	.pipe(plugins.rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest(function (file) {
		return file.base;
	}));

// Process .scss files in the directory using node Sass modules.
let convertScss = () =>
	gulp.src('dist/main.scss')
	.pipe(plugins.sourcemaps.init())
	.pipe(plugins.sass({
		fiber: Fiber,
		errLogToConsole: true
	}))
	.pipe(plugins.sourcemaps.write())
	.pipe(gulp.dest(function (file) {
		return file.base;
	}));

// Purge CSS using node css-purge modules
let cssPurge = () =>
	gulp.src('dist/main.css')
	.pipe(plugins.cssPurge({
		trim: true,
		shorten: true,
		verbose: true
	}))
	.pipe(gulp.dest(function (file) {
		return file.base;
	}));

// Minify and clean CSS
let minifyCSS = () =>
	gulp.src('dist/main.css')
	.pipe(plugins.cleanCss({
		debug: true
	}, (details) => {
		console.log(`${details.name}: ${details.stats.originalSize} ~ ${details.stats.minifiedSize}`);
	}))
	.pipe(plugins.rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest(function (file) {
		return file.base;
	}))
	.pipe(browserSync.stream());

// Pug converter
let convertPug = () =>
	gulp.src('index.pug')
	.pipe(plugins.pug({

	}))
	.pipe(gulp.dest(function (file) {
		return file.base;
	}));

// Minify SVG
let minifySvg = () =>
	gulp.src('assets/**/*.svg')
	.pipe(plugins.newer())
	.pipe(plugins.svgmin())
	.pipe(gulp.dest(function (file) {
		return file.base;
	}));

// Set up BrowserSync server
// Reloads the browser after every save on files edit.
let reload = (done) => {
	browserSync.reload();
	done();
};

// Initialize BrowserSync with default config
let serve = (done) => {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	done();
};

// Export all modules
exports.minifyJS = minifyJS;
exports.convertScss = convertScss;
exports.cssPurge = cssPurge;
exports.minifyCSS = minifyCSS;
exports.convertPug = convertPug;
exports.minifySvg = minifySvg;

// Watch task and perform routine task
let watch = (done) => {
	// Watch and process CSS
	gulp.watch('dist/*.scss', gulp.series(convertScss, cssPurge, minifyCSS, reload));
	// Watch and minify Javascript
	gulp.watch('dist/main.js', gulp.series(minifyJS));
	// Watch and covert pug -> html
	gulp.watch(['dist/svg.pug', 'index.pug'], gulp.series(convertPug, reload));
	// Watch and minify SVG
//	gulp.watch('assets/**/*', gulp.series(minifySvg));

	done();
};

// watch
exports.watch = watch;
exports.default = gulp.series(serve, exports.watch);
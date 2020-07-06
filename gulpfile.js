'use strict';

//Load required node modules
const Fiber = require('fibers');
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

//Sass compiler
plugins.sass.compiler = require('sass');

// Minify Scripts using Terser toplevel,drop_console=true,sequences=false,ecma=6.
// Minified script saved as .min suffix file name.
let minifyJS = () =>
	gulp.src('main.js')
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
	gulp.src('main.scss')
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
	gulp.src('main.css')
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
	gulp.src('main.css')
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
	}));

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
	gulp.watch('main.scss', gulp.series(convertScss, cssPurge, minifyCSS));
	// Watch and minify Javascript
	gulp.watch('main.js', gulp.series(minifyJS));
	// Watch and covert pug -> html
	gulp.watch('index.pug', gulp.series(convertPug));
	// Watch and minify SVG
	gulp.watch('assets/**/*', gulp.series(minifySvg));

	done();
};

// watch
exports.watch = watch;
exports.default = exports.watch;
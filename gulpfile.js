const { series, src, dest, watch } = require('gulp');
const   sass = require("gulp-sass"),
        cssnano = require("gulp-cssnano"),
        autoprefixer = require('gulp-autoprefixer'),
        imagemin = require('gulp-imagemin'), 
        concat = require("gulp-concat"),
        uglify = require("gulp-uglify"), 
        rename = require("gulp-rename"); 
        livereload = require('gulp-livereload');

function html(cb) {
    return src('src/*.html').pipe(dest('dist'));
    cb();
}

function sassCompiler(cb) {
    return src('src/sass/*.sass')
        .pipe(concat('styles.sass'))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/css'));
    cb();
}

function jsCompiler() {
    return src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest("dist/js"));
}

function imgCompresser() {
    return src('src/images/*.+(jpg|jpeg|png|gif)')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true
    }))
    .pipe(dest('dist/images'))
}

const watcher = watch(['src'], series(html, sassCompiler, jsCompiler, imgCompresser));

watcher.on('change', function(path) {
    livereload.listen();
    console.log(`File ${path} was changed`);
});

exports.default = function() {
    watcher.on('change', function(path) {
        console.log(`File ${path} was changed`);
    });
}
/*
* modules
*/
var gulp = require('gulp');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var pug = require('gulp-pug');
var browserSync = require("browser-sync");
var uglify = require('gulp-uglify');
var glob = require("gulp-sass-glob");

//setting : paths
var paths = {
  'scss': './src/sass/',
  'css': './dist/css/',
  'pug': './src/pug/',
  'html': './dist/',
  'srcJs': './src/js/',
  'distJs': './dist/js/'
}

//setting : Sass Options
const sassOptions = {
  outputStyle: 'expanded'
}

//setting : Pug Options
var pugOptions = {
  pretty: true
}

//gulpコマンドの省略
const { watch, series, task, src, dest } = require('gulp');

//Sass
task('sass', function () {
  return (
    src(paths.scss + '**/*.scss')
      .pipe(glob())
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(sass(sassOptions))
      .pipe(autoprefixer())
      .pipe(dest(paths.css))
  );
});

task('pug', function () {
  return (
    src(paths.pug + '**/*.pug')
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(pug(pugOptions))
      // .pipe(autoprefixer())
      .pipe(dest(paths.html))
  );
});

//JS Compress
task('js', function () {
  return (
    src(paths.srcJs + '**/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(dest(paths.distJs))
  );
});

task('browser-reload', function (done){
    browserSync.reload();
    done();
    console.log('Browser reload completed');
});

task('server', function () {
  browserSync({
    notify: false,
    server: {
      baseDir: "dist"
    }
  });
});

//watch
watch([paths.scss + '**/*.scss'], task('sass'));
watch([paths.pug + '**/*.pug'], task('pug'));
watch([paths.srcJs + '**/*.js'], task('js'));
watch(['./dist/**'], task('server'));
watch(['./dist/**'], task('browser-reload'));
task('default', series('sass', 'pug', 'js','browser-reload'));

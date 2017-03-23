const gulp         = require('gulp');
const sass         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const sourceMaps   = require('gulp-sourcemaps');
const browserify   = require('browserify');
const vinylSource  = require('vinyl-source-stream');
const browserSync  = require('browser-sync').create();

gulp.task('default',['css','js','watch']);

gulp.task('css',function () {
  return gulp.src('./assets/css/app.scss')
    .pipe(plumber({
      errorHandler: notify.onError('SASS error: <%= error.message %>')
    }))
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers:['last 10 versions']
    }))
    .pipe(rename('combined.css'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('js',function () {
  return browserify('./assets/js/bootstrap.js',{debug:true})
    .bundle().on('error',function errorHandler (error) {
      //Array.from()
      const args = Array.prototype.slice.call(arguments);
      notify.onError('Browserify error: <%= error.message %>').apply(this, args);
      this.emit('end');
    })
    .pipe(vinylSource('combined.js'))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

gulp.task('watch',function () {
  browserSync.init({
    proxy:'localhost:8880',
    port:3001,
    open:false,
    notify:false,
  });
  gulp.watch([
      'views/*',
      'views/**/*',
      'views/**/*.pug'
    ],{cwd: './'},browserSync.reload);

  gulp.watch([
    'css/*',
    'css/**/*',
    'css/**/*.scss'
  ],{cwd: './assets'},['css'])
    .on('change',browserSync.reload);

  gulp.watch([
      'js/*',
      'js/**/*',
      'js/**/*.js'
    ],{cwd: './assets'},['js'])
    .on('change',browserSync.reload);
});

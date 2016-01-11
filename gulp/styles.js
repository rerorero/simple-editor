var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config');

gulp.task('styles:dev', function () {
  return gulp.src(config.styles.src)
    .pipe($.stylus())
    .pipe($.concat(config.styles.concat))
    .pipe($.autoprefixer(config.styles.autoprefixer))
    .pipe(gulp.dest(config.workDirs.dev));
});

gulp.task('styles:dist',['styles:dev']);

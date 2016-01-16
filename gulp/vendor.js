var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config');

gulp.task('vendor:dev', function () {
  return gulp.src(config.vendor.src)
    .pipe(gulp.dest(config.vendor.dev));
});

gulp.task('vendor:dist', function () {
  return gulp.src(config.vendor.src)
    .pipe(gulp.dest(config.vendor.dist));
});

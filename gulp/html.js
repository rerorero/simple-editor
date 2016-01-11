var gulp = require('gulp');
var config = require('./config');
var $ = require('gulp-load-plugins')();

gulp.task('html:dev', function () {
  return gulp.src(config.index.src)
    .pipe(gulp.dest(config.workDirs.dev));
});

gulp.task('html:dist', function () {
  return gulp.src(config.index.src)
    .pipe($.useref())
    .pipe(gulp.dest(config.workDirs.dev));
});

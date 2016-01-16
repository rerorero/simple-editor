var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config');

function stylesTask(dest) {
  return gulp.src(config.styles.src)
    .pipe($.stylus())
    .pipe($.concat(config.styles.concat))
    .pipe($.autoprefixer(config.styles.autoprefixer))
    .pipe(gulp.dest(dest));
}
gulp.task('styles:dev', function () {
  return stylesTask(config.workDirs.dev);
});

gulp.task('styles:dist', function () {
  return stylesTask(config.workDirs.dist);
});

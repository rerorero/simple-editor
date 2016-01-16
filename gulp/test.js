var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config');

gulp.task('test', ['html:dev', 'compile:dev', 'styles:dev', 'test:compile'], function() {
  var fileOpt = process.argv[4];
  if (typeof fileOpt !== 'string') {
    fileOpt = config.test.dev;
  }
  return gulp.src(fileOpt, {read: false})
    .pipe($.mocha({reporter: 'list'}));
});

gulp.task('test:compile', function() {
  return gulp.src(config.test.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ["es2015", "react"]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.workDirs.dev));
});

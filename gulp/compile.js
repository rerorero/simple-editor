var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var config = require('./config');

gulp.task('compile:dist', function() {
  return gulp.src(config.js.src)
    .pipe($.babel({
      presets: ["es2015", "react"]
    }))
    .pipe(gulp.dest(config.workDirs.dev));
});

function compileTask(watch) {
  var task = gulp.src(config.js.src);
  if (watch) {
    task = task.pipe($.watch(config.js.src), {verbose: true});
  }
  return task.pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ["es2015", "react"]
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.workDirs.dev));
}

gulp.task('compile:dev:watch', function(done) {
  compileTask(watch = true);
  done();
});

gulp.task('compile:dev', function() {
  return compileTask(watch = false);
});

var gulp = require('gulp');
var del = require('del');
var config = require('./config');

var workDirs = Object.keys(config.workDirs).map(function (k) {
  return config.workDirs[k];
});

gulp.task('clean', function (done) {
  del(workDirs, function () {
    done();
  });
});

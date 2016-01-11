var gulp = require('gulp');
var electronServer = require('electron-connect').server;
var config = require('./config');

gulp.task('dev', ['html:dev', 'compile:dev:watch', 'styles:dev'], function () {
  var electron = electronServer.create();
  electron.start();

  gulp.watch(config.index.src, ['html:dev']);
  gulp.watch([config.main.dev], electron.restart);
  gulp.watch([config.styles.dev, config.index.dev, config.js.dev], electron.reload);
});

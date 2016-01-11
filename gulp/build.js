var gulp = require('gulp');

gulp.task('build', [
  'html:dist', 'compile:dist', 'styles:dist'
]);

gulp.task('rebuild', ['clean', 'build']);

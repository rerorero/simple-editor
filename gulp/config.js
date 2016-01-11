var path = require('path');

var app = './app';
var dev = './dev';
var dist = './dist/target';

module.exports = {
  js: {
    src: app + '/**/*.{js,jsx}',
    dev: dev + '/**/*.{js,jsx}'
  },

  test: {
    src: test + '/**/*.test.{js,jsx}',
    dev: dev + '/**/*.test.{js,jsx}'
  }

  index: {
    src: app + '/index.html',
    dev: dev + '/index.html'
  },

  main: {
    src: app + '/main.js',
    dev: dev + '/main.js'
  },

  styles: {
    src: app + '/styles/**/!(_)*',
    concat: 'app.css',
    dev: dev + '/app.css',
    autoprefixer: {
      browsers: ['last 2 versions']
    }
  },

  workDirs: {
    dev: dev,
    dist: dist
  }
};

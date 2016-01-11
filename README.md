My Electron Boilerplate
======
* live reload (electron-connect)
* React.js and flux
* Javascript on babel
* css on stylus
* task on gulp

Get Started
======
1. `npm i`
2. `npm start` or `gulp`



Application Distribution
======

### Pre-requisites for distribution
##### Mac OS X
```
$ brew install wine makensis
```

##### Windows
Download [nullsoft scriptable installer](http://nsis.sourceforge.net/Download) and include NSIS in your PATH.
```
set PATH=%PATH%;C:\Program Files (x86)\NSIS
```

### Distribution
How to generate installer packages are follows.
```
$ npm run dist

# for Windows
target/dist/win/sample Setup.exe

# for Mac OS X
target/dist/osx/sample.dmg
```

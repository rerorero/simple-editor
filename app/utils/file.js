'use strict';
import fs from 'fs';

const syncFuncKeyworkds = /Sync$|watch|(Read|Write)Stream$|^Stats$/;

function toPromiseFunc(f){
  return (...args) => {
    return new Promise((resolve, reject) => {
      args.push((err, ...rest) => {
        if(err) reject(err);
        else resolve(...rest);
      });
      f.apply(fs, args);
    });
  };
}

var fsPromise = {};

Object.keys(fs).forEach((key) =>{
  const prop = fs[key];
  if (typeof prop === 'function') {
    if (syncFuncKeyworkds.test(prop)) {
      fsPromise[key] = prop;
    } else {
      fsPromise[key] = toPromiseFunc(prop);
    }
  }
});

function pathToName(path) {
  return path.match(".+/(.+?)([\?#;].*)?$")[1];
}

function toRelativePath(path, rootPath) {
  if (!path.includes(rootPath))
    throw "path does not include rootPath.";
  return path.replace(rootPath + "/", "");
}

const file = {
  fsPromise,
  pathToName,
  toRelativePath
};

export default file;

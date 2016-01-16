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
      try {
        f.apply(fs, args);
      } catch (e) {
        reject(e);
      }
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
  const matches = path.match(".+/(.+?)([\?#;].*)?$");
  return matches === null ? path : matches[1];
}

function toRelativePath(path, rootPath) {
  if (!path.includes(rootPath))
    throw "path does not include rootPath.";
  return path.replace(rootPath + "/", "");
}

function isSubPath(parent, target) {
  return target.indexOf(parent) === 0;
}

const file = {
  fsPromise,
  pathToName,
  toRelativePath,
  isSubPath
};

export default file;

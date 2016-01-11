'use strict';
import types from '../constants/SampleTypes';
import fs from 'fs';

function gotFile(path) {
  let buf;
  try {
    buf = fs.readFileSync(path, 'utf8');
  } catch (err) {
    buf = err;
  }
  return {
    type: types.GOT_FILE,
    data: buf
  };
}

function gotDir(path) {
  let files;
  try {
    files = fs.readdirSync(path);
  } catch (err) {
    files = err;
  }
  return {
    type: types.GOT_DIR,
    data: files
  };
}

function gotOther(data) {
  return {
    type: types.GOT_OTHER,
    data: data
  };
}

function checkPathAsync(path) {
  return dispatch => {
    console.log("check: " + path);
    return new Promise( resolve => {
      let stat;
      try {
        stat = fs.statSync(path);
        console.log("fs.stat: " + stat);
      } catch (err) {
        console.log("fs.stat error: " + err);
        dispatch(gotOther(err));
        return;
      }

      if (stat.isFile()) {
        dispatch(gotFile(path));
      } else if (stat.isDirectory()) {
        dispatch(gotDir(path));
      } else {
        dispatch(gotOther('other'));
      }
    });
  };
}

export function checkPath(path) {
  return (dispatch, getState) => {
    return dispatch(checkPathAsync(path));
  };
}

'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';

const fs = file.fsPromise;

function rootChangeAction(root) {
  return {
    type: actionTypes.DIRTREE_ROOT_CHANGED,
    root
  };
}


function newNode(path, rootPath, stat) {
  var isDir = false;
  var isFile = false;
  if (stat.isDirectory()) {
    isDir = true;
  } else if (stat.isFile()) {
    isFile = true;
  } else {
    return null;
  }

  return {
    isDir,
    isFile,
    expanded: false,
    name: file.pathToName(path),
    path: file.toRelativePath(path, rootPath),
    child: null
  };
}

function setRootPath(path) {
  return dispatch => {
    console.log("setRootPath: " + path);

    return fs.stat(path)
      .then((stat) => {
        if (stat.isDirectory()) {
          const root = newNode(path, path, stat);
          dispatch(rootChangeAction(root));

        } else {
          // TODO: dispatch error action
          console.log('Failed in setRootPath, not a directory: ' + path);
          dispatch(rootChangeAction(null));
        }
      }).catch((error) => {
        // TODO: dispatch error action.
        console.log('Failed in setRootPath: ');
        console.log(error);
        dispatch(rootChangeAction(null));
      });
  };
}

function expandNode(nodePath, rootPath) {
  return dispatch => {
    console.log("expandNode: " + nodePath + ", " + rootPath);

  };
}

export function onTreeRootChanged(rootPath) {
  return (dispatch, getState) => {
    return dispatch(setRootPath(rootPath));
  };
}

export function onTreeNodeExpanded(path, rootPath) {
  return (dispatch, getState) => {
    return dispatch(expandNode(path, rootPath));
  };
}

export function onTreeNodeContracted(path, rootPath) {

}

export function onTreeNodeSelected(path, rootPath) {

}

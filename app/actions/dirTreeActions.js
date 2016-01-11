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

function nodeChangedAction(node) {
  return {
    type: actionTypes.DIRTREE_NODE_CHANGED,
    node
  };
}

function newNode(path, stat, children = null) {
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
    name: file.pathToName(path),
    path: path,
    children
  };
}

export function onTreeRootChanged(path) {
  return dispatch => {
    console.log("onTreeRootChanged: " + path);

    return fs.stat(path)
      .then((stat) => {
        if (stat.isDirectory()) {
          const root = newNode(path, stat);
          dispatch(rootChangeAction(root));

        } else {
          // TODO: dispatch error action
          console.log('Failed in onTreeRootChanged, not a directory: ' + path);
          dispatch(rootChangeAction(null));
        }
      }).catch((error) => {
        // TODO: dispatch error action.
        console.log('Failed in onTreeRootChanged: ');
        console.log(error);
        dispatch(rootChangeAction(null));
      });
  };
}

export function onTreeNodeVisibleChildrenChanged(nodePath, visible, rootPath) {
  console.log("onTreeNodeVisibleChildrenChanged: " + nodePath + ", " + visible + ", "+ rootPath);
  return dispatch => {
    return fs.stat(nodePath)
      .then((nodeStat) => {

        if (nodeStat.isDirectory() && visible) {
          return fs.readdir(nodePath)
            .then((files) => {
              // return Promise([[absolutePath, stat], [absolutePath2, stat2], ...])
              return Promise.all( files.map((f) => {
                const childPath = nodePath + "/" + f;
                return fs.stat(childPath)
                  .then((childStat) => [childPath, childStat]);
              }));
            }).then((childStats) => {
              const childNodes = childStats.map((pair) => {
                const [path, stat] = pair;
                return newNode(path, stat);
              });
              return newNode(nodePath, nodeStat, childNodes);
            });

        } else {
          console.log("onTreeNodeVisibleChildrenChanged: not directory or invisible: " + nodePath);
          return newNode(nodePath, nodeStat);
        }

      }).then((node) => {
        dispatch(nodeChangedAction(node));

      }).catch((err) => {
        // TODO error dispatch
        console.log("onTreeNodeVisibleChildrenChanged: error occurred: ");
        console.log(err);
      });
  };
}

export function onTreeNodeSelected(path, rootPath) {
  // TODO
  throw 'not implemented';
}

'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';
import * as model from '../model';

const fs = file.fsPromise;

/**
 * Creates a root changing action
 * @param  {DirTreeNode} root
 * @return {object}      action
 */
function rootChangeAction(root) {
  return {
    type: actionTypes.DIRTREE_ROOT_CHANGED,
    root
  };
}

/**
 * Creates a node state changing action
 * @param  {DirTreeNode} node
 * @return {object}      action
 */
function nodeChangedAction(node) {
  return {
    type: actionTypes.DIRTREE_NODE_CHANGED,
    node
  };
}

function nodeSelectedAction(nodePath) {
  return {
    type: actionTypes.DIRTREE_NODE_SELECTED,
    nodePath
  };
}

/**
 * Handle tree root changed.
 * @param  {string} path  Abstract path to which root points
 * @return {dispatch => Promise}  dispatch function
 */
export function onTreeRootChanged(path) {
  return dispatch => {
    console.log("onTreeRootChanged: " + path);

    return fs.stat(path)
      .then((stat) => {
        if (stat.isDirectory()) {
          const type = model.DirTreeNode.statToType(stat);
          const root = new model.DirTreeNode(path, path, type);
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

/**
 * Handle action to expand/contruct directory tree.
 * @param  {string} nodePath  Abstract path of node to change
 * @param  {boolean} visible  visibility
 * @return {dispatch => Promise}          dispatch function
 */
export function onTreeNodeVisibleChildrenChanged(nodePath, rootPath, visible) {
  console.log("onTreeNodeVisibleChildrenChanged: " + nodePath + ", " + visible);
  return dispatch => {
    return fs.stat(nodePath)
      .then((nodeStat) => {
        const type = model.DirTreeNode.statToType(nodeStat);

        if (nodeStat.isDirectory() && visible) {
          return fs.readdir(nodePath)
            .then(files => {
              // return Promise([[absolutePath, stat], [absolutePath2, stat2], ...])
              return Promise.all( files.map(f => {
                const childPath = nodePath + "/" + f;
                return fs.stat(childPath)
                  .then(childStat => [childPath, childStat]);
              }));
            }).then(childStats => {
              const childNodes = childStats.map(pair => {
                const [path, stat] = pair;
                const childType = model.DirTreeNode.statToType(stat);
                return new model.DirTreeNode(path, rootPath, childType);
              });
              return new model.DirTreeNode(nodePath, rootPath, type, childNodes);
            });

        } else {
          console.log("onTreeNodeVisibleChildrenChanged: not directory or invisible: " + nodePath);
          return new model.DirTreeNode(nodePath, rootPath, type);
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

export function onTreeNodeSelected(path) {
  console.log("onTreeNodeSelected:", path);
  return dispatch => {
    dispatch(nodeSelectedAction(path))
  }
}

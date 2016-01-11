'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';

function updateNode(tree, newNode) {
  if (tree === null)
    return null;

  if (tree.path === newNode.path)
    return newNode;

  if (file.isSubPath(tree.path, newNode.path)) {
    if (tree.children === null)
      return tree;

    return Object.assign({}, tree, {
      children: updateNode(tree.children, newNode)
    });

  } else {
    return tree;
  }
}

function getNode(tree, nodePath, found = null) {
  if (found !== null)
    return found;

  if (tree === null)
    return null;

  if (tree.path === nodePath)
    return tree;

  if (file.isSubPath(tree.path, nodePath)) {
    if (tree.children === null)
      return null;

    return getNode(tree.children, nodePath, found);

  } else {
    return null;
  }
}

export default function directoryTreeState(state = null, action) {
  const tree = state;
  switch (action.type) {
    case actionTypes.DIRTREE_NODE_CHANGED:
      if (getNode(tree, action.node.path) === null) {
        console.log("not found path: " + action.node.path);
        return state;
      }
      return updateNode(tree, action.node);

    case actionTypes.DIRTREE_ROOT_CHANGED:
      return action.root;

    default:
      return state;
  }
}

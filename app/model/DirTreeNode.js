'use strict';

import file from '../utils/file';
import keyMirror from 'keymirror';
import { gen } from 'jsarbit';

const types = keyMirror({
  FILE: null,
  DIRECTORY: null,
  OTHER: null
});

/**
 * Replace node in tree to newNode.
 * @param  {DirTreeNode} tree
 * @param  {DirTreeNode} newNode  ner node
 * @return {DirTreeNode} updated tree
 */
function findAndUpdated(tree, newNode) {
  if (tree === null)
    return null;

  if (tree.path === newNode.path)
    return newNode;

  if (file.isSubPath(tree.path, newNode.path)) {
    if (tree.children === null)
      return tree;

    return tree.copy(tree.children.map(c => findAndUpdated(c, newNode)));

  } else {
    return tree;
  }
}

function find(tree, nodePath, found = null) {
  if (found !== null)
    return found;

  if (tree === null)
    return null;

  if (tree.path === nodePath)
    return tree;

  if (file.isSubPath(tree.path, nodePath)) {
    if (tree.children === null)
      return null;

    return tree.children.reduce((_found, child) => {
      if (_found === null) {
        return find(child, nodePath, _found);
      } else {
        return _found;
      }
    }, null);

  } else {
    return null;
  }
}

function traverse(tree, func, acc) {
  if (tree.children !== null) {
    acc = tree.children.reduce((_acc, child) => traverse(child, func, _acc), acc);
  }
  return func(acc, tree);
}

function arbitraryFileNode(parentPath, rootPath) {
  return gen.identifier(5,10).map(name => {
    return new DirTreeNode(parentPath + '/file-' + name, rootPath, types.FILE);
  });
}

function arbitraryDirNode(parentPath, rootPath, minChildNum = 0, maxChildNum = 4) {
  return gen.identifier(5,10).flatMap(name => {
    const dirPath = parentPath + '/dir-' + name;
    return gen.array(arbitraryNode(dirPath, rootPath), minChildNum, maxChildNum).map(children => {
      return new DirTreeNode(dirPath, rootPath, types.DIRECTORY, children);
    });
  });
}

function arbitraryNode(parentPath, rootPath, minChildNum = 0, maxChildNum = 4) {
  return gen.frequency([
    [3, arbitraryFileNode(parentPath, rootPath)],
    [1, arbitraryDirNode(parentPath, rootPath, minChildNum, maxChildNum)],
  ]);
}

function arbitraryRoot(path, childNum = 4) {
  return arbitraryDirNode(path, path, childNum, childNum);
}

const arbitrary = {
  file: arbitraryFileNode,
  dir: arbitraryDirNode,
  node: arbitraryNode,
  root: arbitraryRoot
};

export default class DirTreeNode {

  static types() { return types; }

  static statToType(stats) {
    if (stats.isDirectory()) {
      return types.DIRECTORY;
    } else if (stats.isFile()) {
      return types.FILE;
    } else {
      return types.OTHER;
    }
  }

  static arbitrary() { return arbitrary; }

  /**
   * Creates a new instance.
   * @param  {string} path     Abstract path to the node
   * @param  {string} rootPath Abstract path to the root of tree.
   * @param  {types} type   one of types.
   * @param  {DirTreeNode} children    Sub nodes. If this node is leaf it takes null.
   * @return {Array of DirTreeNode}          new instance
   */
  constructor(path, rootPath, type, children = null) {
    if (Object.keys(types).indexOf(type) < 0)
      throw new TypeError('invalid type: ' + type);

    if (path !== rootPath && !file.isSubPath(rootPath, path))
      throw new RangeError('path must be sub tree of rootPath: '+path+', '+rootPath);

    this.path = path;
    this.rootPath = rootPath;
    this.type = type;
    this.name = file.pathToName(path);
    this.children = children;
  }

  isDir() {
    return this.type === types.DIRECTORY;
  }

  isFile() {
    return this.type === types.FILE;
  }

  copy(children) {
    if (!Array.isArray(children))
      throw new TypeError('children is not an array. ' + children);
    return new DirTreeNode(this.path, this.rootPath, this.type, children);
  }

  findAndUpdated(newNode) {
    // TODO redudant finds
    if (this.findByPath(newNode.path) === null) {
      return null;
    } else {
      return findAndUpdated(this, newNode);
    }
  }

  findByPath(nodePath) {
    if (typeof nodePath !== 'string')
      throw new TypeError('nodePath is not a string.: ' + nodePath);
    return find(this, nodePath);
  }

  traverse(func, acc) {
    return traverse(this, func, acc);
  }

  size() {
    return this.traverse(sum => sum + 1, 0);
  }
}

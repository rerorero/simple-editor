/* global describe, it */
'use strict';
import chai from 'chai';
import DirTreeNode from './DirTreeNode';
import {forAll} from 'jsarbit';
const assert = chai.assert;

describe('DirTreeNode', () => {

  describe('constructor', () => {
    it('generates new instance.', () => {
      const treeArb = DirTreeNode.arbitrary().root('/root', 4);
      forAll(treeArb, (tree) => assert(tree.size() > 4));
    });
  });

  describe('find', () => {
    it('returns a node which path is same', () => {
      const treeArb = DirTreeNode.arbitrary().root('/root', 4);
      forAll(treeArb, (tree) => {
        tree.traverse((acc, node) => {
          assert(tree.findByPath(node.path) === node);
          assert(tree.findByPath(node.path + '_hooo') === null);
        }, null);
      });
    });
  });

  describe('findAndUpdated', () => {
    it('returns updated tree', () => {
      const tree = DirTreeNode.arbitrary().root('/root', 4).sample();
      const targetOrg = tree.children[3];
      const path = targetOrg.path;
      const updatedChildren = DirTreeNode.arbitrary().node(path, tree.path, 5, 5).sample();
      const updatedNode = targetOrg.copy([updatedChildren]);
      const updated = tree.findAndUpdated(updatedNode);
      assert(tree.findByPath(path) === targetOrg);
      assert(updated.findByPath(path) === updatedNode);
      assert(tree.path === updated.path);
    });

    it('returns null if no updated', () => {
      const tree = DirTreeNode.arbitrary().root('/root', 4).sample();
      const target = DirTreeNode.arbitrary().file(tree.path + '/no-parent', tree.path).sample();
      assert(tree.findAndUpdated(target) === null);
    });
  });
});

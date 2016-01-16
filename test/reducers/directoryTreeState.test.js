/* global describe, it */
'use strict';
import actionTypes from '../constants/actionTypes';
import directoryTreeState from './directoryTreeState';
import * as model from '../model';
import chai from 'chai';
import {forAll, gen} from 'jsarbit';

const assert = chai.assert;

describe('directoryTreeState', () => {

  describe('actionTypes.DIRTREE_ROOT_CHANGED', () => {

    it('sets root node.', () => {
      const arbOrg = model.DirTreeNode.arbitrary().root('/root');
      const arbNew = model.DirTreeNode.arbitrary().root('/root');
      forAll(gen.obj({arbOrg, arbNew}), v => {
        const action = {
          type: actionTypes.DIRTREE_ROOT_CHANGED,
          root: v.arbNew
        };
        assert(directoryTreeState(v.arbOrg, action) === v.arbNew);
      });
    });

    it('can set null state.', () => {
      const arb = model.DirTreeNode.arbitrary().root('/root');
      forAll(arb, v => {
        const action = {
          type: actionTypes.DIRTREE_ROOT_CHANGED,
          root: null
        };
        assert(directoryTreeState(v, action) === null);
      });
    });

  });

  describe('actionTypes.DIRTREE_NODE_CHANGED', () => {

    it('updates node.', () => {
      const arb = model.DirTreeNode.arbitrary().root('/root', 6)
        .flatMap(tree => gen.choose(0, 5).map(i => [tree, i]));
      forAll(arb, pair => {
        const [tree, index] = pair;
        const org = tree.children[index];
        const newChildren = model.DirTreeNode.arbitrary().file(org.path, tree.path).sample();
        const updated = org.copy([newChildren]);
        const action = {
          type: actionTypes.DIRTREE_NODE_CHANGED,
          node: updated
        };

        const actualState = directoryTreeState(tree, action);
        assert(tree.findByPath(newChildren.path) === null, 'findByPath() is not null');
        assert(actualState.findByPath(newChildren.path) === newChildren, 'findByPath() is null');
        assert(tree.path === actualState.path);
      });
    });

  });
});

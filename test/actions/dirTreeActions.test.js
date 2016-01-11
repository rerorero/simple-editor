/* global describe, it */
'use strict';
import * as actions from './dirTreeActions';
import actionTypes from '../constants/actionTypes';
import sinon from 'sinon';
import chai from 'chai';
import TestDispatcher from './TestDispatcher.test';
const assert = chai.assert;

const dir = ".";
const file = ".";

describe('dirTreeActions', () => {

  describe('onTreeRootChanged', () => {
    it('dispatches root-changed action if root is directory.', () => {
      const f = actions.onTreeRootChanged(dir);
      const dispatcher = new TestDispatcher();
      const expected = {
        type: actionTypes.DIRTREE_ROOT_CHANGED,
        root: {
          isDir: true,
          isFile: false,
          name: dir,
          path: dir,
          children: null
        }
      };

      return f(dispatcher.mock())
        .then(() => assert.deepEqual(dispatcher.lastAction, expected));
    });
  });

  describe('onTreeNodeVisibleChildrenChanged', () => {
    it('dispatches showing children action.', () => {
      const f = actions.onTreeNodeVisibleChildrenChanged(dir, true, dir);
      const dispatcher = new TestDispatcher();
      return f(dispatcher.mock())
        .then(() => {
          const actual = dispatcher.lastAction;
          assert(actual.type === actionTypes.DIRTREE_NODE_CHANGED);
          const root = actual.node;
          assert(root.isDir);
          assert(!root.isFile);
          assert(root.name === dir);
          assert(root.path === dir);
          assert(root.children.find((c) => c.name === 'node_modules'));
          // check file
          const json = root.children.find((c) => c.name === 'package.json');
          assert(json.isFile);
          assert(!json.isDir);
          assert(json.path === (dir + "/" + json.name));
          assert(json.children === null);
          // check sub dir
          const mods = root.children.find((c) => c.name === 'node_modules');
          assert(!mods.isFile);
          assert(mods.isDir);
          assert(json.children === null);
        });
    });

    it('dispatches showing sub node action.', () => {
      const f = actions.onTreeNodeVisibleChildrenChanged(dir + '/node_modules', true, dir);
      const dispatcher = new TestDispatcher();
      return f(dispatcher.mock())
        .then(() => {
          const actual = dispatcher.lastAction;
          assert(actual.type === actionTypes.DIRTREE_NODE_CHANGED);
          const root = actual.node;
          assert(root.isDir);
          assert(!root.isFile);
          assert(root.name === 'node_modules');
          assert(root.path === (dir + '/node_modules'));
          assert(root.children.find((c) => c.name === 'babel'));
        });
    });

    it('dispatches hiding children action.', () => {
      const f = actions.onTreeNodeVisibleChildrenChanged(dir, false, dir);
      const dispatcher = new TestDispatcher();
      return f(dispatcher.mock())
        .then(() => {
          const actual = dispatcher.lastAction;
          assert(actual.type === actionTypes.DIRTREE_NODE_CHANGED);
          const root = actual.node;
          assert(root.isDir);
          assert(!root.isFile);
          assert(root.name === dir);
          assert(root.path === dir);
          assert(root.children === null);
        });
    });
  });
});

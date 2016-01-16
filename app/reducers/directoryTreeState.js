'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';

/**
 * State of directory tree.
 * @param  {DirTreeNode} state  prestate of directory tree
 * @param  {object} action action to be dispatched
 * @return {DirTreeNode}  new state of directory tree
 */
export default function directoryTreeState(state = null, action) {
  const tree = state;

  switch (action.type) {

    case actionTypes.DIRTREE_NODE_CHANGED:
      if (state === null) {
        console.warn('DIRTREE_NODE_CHANGED action occured, but state is null.');
        return null;
      }
      const updated = tree.findAndUpdated(action.node);
      if (updated === null) {
        console.log("not found path: " + action.node.path);
        return state;
      }
      return updated;

    case actionTypes.DIRTREE_ROOT_CHANGED:
      return action.root;

    default:
      return state;
  }
}

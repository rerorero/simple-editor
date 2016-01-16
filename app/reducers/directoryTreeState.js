'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';

const initialState = {
  tree: null,         // DirTreeNode
  selected: null      // selected path string
};

export default function directoryTreeState(state = initialState, action) {

  switch (action.type) {

    case actionTypes.DIRTREE_NODE_CHANGED:
      if (state.tree === null) {
        console.warn('DIRTREE_NODE_CHANGED action occured, but state is null.');
        return initialState;
      }
      const updated = state.tree.findAndUpdated(action.node);
      if (updated === null) {
        console.log("not found path: " + action.node.path);
        return state;
      }
      return Object.assign({}, state, {
        tree: updated
      });

    case actionTypes.DIRTREE_ROOT_CHANGED:
      return Object.assign({}, state, {
        tree: action.root,
        selected: initialState.selected
      });

    case actionTypes.DIRTREE_NODE_SELECTED:
      return Object.assign({}, state, {
        selected: action.nodePath
      });

    default:
      return state;
  }
}

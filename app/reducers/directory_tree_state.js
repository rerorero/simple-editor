'use strict';
import actionTypes from '../constants/actionTypes';

export default function directoryTreeState(state = null, action) {
  switch (action.type) {
    case actionTypes.DIRTREE_NODE_STATE_CHANGED:
      // TODO
      return state;

    case actionTypes.DIRTREE_ROOT_CHANGED:
      return action.root;

    default:
      return state;
  }
}

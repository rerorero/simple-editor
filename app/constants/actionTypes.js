'use strict';
import keyMirror from 'keymirror';

const actionTypes = keyMirror({
  DIRTREE_NODE_CHANGED: null,
  DIRTREE_ROOT_CHANGED: null,
  DIRTREE_NODE_SELECTED: null,

  WM_FILELOAD_START: null,
  WM_FILELOAD_FINISH: null,

  SOURCE_ADD_NEW: null,
  SOURCE_SET_CURRENT_EDITING: null

});

export default actionTypes;

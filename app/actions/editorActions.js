'use strict';

import actionTypes from '../constants/actionTypes';
import * as model from '../model';

function addNewSourceAction(source) {
  return {
    type: actionTypes.SOURCE_ADD_NEW,
    source
  };
}

function setCurrentEditing(source) {
  return {
    type: actionTypes.SOURCE_SET_CURRENT_EDITING,
    source
  };
}

export function setCurrentSource(sourceState, path) {
  return dispatch => {
    const source = new model.WorkSource(path);

    if (sourceState.currentEditing(source))
      return;

    if (sourceState.sources.findIndex(src => src.sameOrigin(source)) < 0) {
      return source.syncPromise()
        .then(synched => {
          dispatch(addNewSourceAction(synched));
          dispatch(setCurrentEditing(synched));
        });
    } else {
      dispatch(setCurrentEditing(source));
    }
  };
}

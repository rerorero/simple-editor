'use strict';
import actionTypes from '../constants/actionTypes';
import file from '../utils/file';

const initialState = {
  sources: [],
  currentEditing: null
};

export default function sourceState(state = initialState, action) {

  switch (action.type) {

    case actionTypes.SOURCE_ADD_NEW:
      return state;

    default:
      return state;

  }
}

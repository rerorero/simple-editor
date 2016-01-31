'use strict';
import { combineReducers } from 'redux';
import directoryTreeState from './directoryTreeState';
import sourceState from './sourceState';

const rootReducer = combineReducers({
  directoryTreeState,
  sourceState
});

export default rootReducer;

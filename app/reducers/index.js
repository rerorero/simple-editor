'use strict';
import { combineReducers } from 'redux';
import directoryTreeState from './directoryTreeState';

const rootReducer = combineReducers({
  directoryTreeState
});

export default rootReducer;

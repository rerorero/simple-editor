'use strict';

export default class TestDispatcher {
  constructor(tracable = false) {
    this.tracable = tracable;
    this.lastAction = null;
  }

  dispatch(action) {
    if (this.tracable)
      console.log("TestDispatcher.dispatch() called: " + action);
    this.lastAction = action;
  }

  mock() {
    return this.dispatch.bind(this);
  }
}

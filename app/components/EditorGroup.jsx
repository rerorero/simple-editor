'use strict';

import React, {Component, PropTypes} from 'react';

export default class EditorGroup extends Component {
  render() {

    return(
      <div style={{width: '100%'}}>
        <div className="tab-group">
          <div className="tab-item">
            <span className="icon icon-cancel icon-close-tab"></span>
            Tab
          </div>
          <div className="tab-item active">
            <span className="icon icon-cancel icon-close-tab"></span>
            Tab active
          </div>
          <div className="tab-item">
            <span className="icon icon-cancel icon-close-tab"></span>
            Tab
          </div>
          <div className="tab-item tab-item-fixed">
            <span className="icon icon-plus"></span>
          </div>
        </div>
      </div>
    );
  }
}

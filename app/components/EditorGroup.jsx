'use strict';

import React, {Component, PropTypes} from 'react';
import Editor from './Editor';

export default class EditorGroup extends Component {

  render() {
    const style = {
      width: '100%',
      height: '100%'
    };

    console.log(this.props);
    const tabs = this.props.tabs.map(tab => {
      const active = (tabs.indexOf(tab) === this.props.activeIndex) ? 'active' : '';
      return (
        <div className={"tab-item " + active}>
          <span className="icon icon-cancel icon-close-tab" />
          {tab}
        </div>
      );
    });

    return(
      <div style={style}>
        <div className="tab-group">
          {tabs}
          <div className="tab-item tab-item-fixed">
            <span className="icon icon-plus"></span>
          </div>
        </div>
        <Editor/>
      </div>
    );
  }
}

EditorGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  activeIndex: PropTypes.number,
  editorContents: PropTypes.node
};

EditorGroup.defaultProps = {
  tabs: []
};

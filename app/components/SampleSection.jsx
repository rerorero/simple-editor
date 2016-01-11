'use strict';

import React, {Component, PropTypes} from 'react';

class SampleSection extends Component {

  handleOnBlur(e) {
    const path = e.target.value.trim();
    this.props.actions.checkPath(path);
  }

  render() {
    let samples = this.props.samples;
    let fstype;

    if (samples.isDir) {
      fstype = 'directory';
    } else if (samples.isFile) {
      fstype = 'file';
    } else {
      fstype = 'other';
    }

    return (
      <div>
        <input
          type="text"
          autoFocus="true"
          onBlur={this.handleOnBlur.bind(this)} />
        <h1>{fstype}</h1>
        <div>
          {this.props.samples.data}
        </div>
      </div>
    );
  }
}

SampleSection.propTypes = {
  samples: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default SampleSection;

'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DirectoryTree from '../components/DirectoryTree';
import * as DirectoryTreeActions from '../actions/directory_tree';
import { bindActionCreators } from 'redux';

class App extends Component {
  render() {

    return (
      <div>
        <DirectoryTree
          directoryTreeState={this.props.directoryTreeState}
          actions={this.actions.dirTreeActions} />
      </div>
    );
  }
}

App.propTypes = {
  props: PropTypes.shape({
    directoryTreeState: PropTypes.object.isRequired
  }),
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    dirTreeActions: bindActionCreators(DirectoryTreeActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

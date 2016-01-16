'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DirectoryTree from '../components/DirectoryTree';
import * as dirTreeActions from '../actions/dirTreeActions';
import { bindActionCreators } from 'redux';

class App extends Component {
  handleOnClick(e) {
    this.props.actions.dirTreeActions.onTreeRootChanged(".");
  }

  render() {
    return (
      <div>
        <DirectoryTree
          directoryTreeState={this.props.directoryTreeState}
          actions={this.props.actions.dirTreeActions}
          />
        <span onClick={this.handleOnClick.bind(this)}>test</span>
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
    actions: {
      dirTreeActions: bindActionCreators(dirTreeActions, dispatch)
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

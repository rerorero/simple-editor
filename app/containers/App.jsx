'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DirectoryTree from '../components/DirectoryTree';
import EditorGroup from '../components/EditorGroup';
import {Pane, PaneWindow, paneTypes} from '../components/controll/Pane';
import * as dirTreeActions from '../actions/dirTreeActions';
import { bindActionCreators } from 'redux';

class App extends Component {
  handleOnClick(e) {
    this.props.actions.dirTreeActions.onTreeRootChanged(".");
  }

  render() {
    const paneProps = {pane1: {
      id: 'directory-tree'
    }};
    return (
      <PaneWindow type={paneTypes.vertical} pane1InitSize={200} paneProps={paneProps}>

        <DirectoryTree
          directoryTreeState={this.props.directoryTreeState}
          actions={this.props.actions.dirTreeActions}
          />

        <PaneWindow type={paneTypes.horizontal} pane1InitSize={400}>

          <EditorGroup/>

          <div>
            <span>TODO.. console output screen</span>
            <div onClick={this.handleOnClick.bind(this)}>test</div>
          </div>

        </PaneWindow>

      </PaneWindow>
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

'use strict';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DirectoryTree from '../components/DirectoryTree';
import EditorGroup from '../components/EditorGroup';
import Editor from '../components/Editor';
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
      <div>
      <header className="toolbar toolbar-header">
        <h1 className="title">Header with actions</h1>

        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default">
              <span className="icon icon-home"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-folder"></span>
            </button>
            <button className="btn btn-default active">
              <span className="icon icon-cloud"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-popup"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-shuffle"></span>
            </button>
          </div>

          <button className="btn btn-default">
            <span className="icon icon-home icon-text"></span>
            Filters
          </button>

          <button className="btn btn-default btn-dropdown pull-right">
            <span className="icon icon-megaphone"></span>
          </button>
        </div>
      </header>

      <PaneWindow type={paneTypes.vertical} pane1InitSize={200} paneProps={paneProps}>

        <DirectoryTree
          directoryTreeState={this.props.directoryTreeState}
          sourceState={this.props.sourceState}
          actions={this.props.actions}
          />

        <PaneWindow type={paneTypes.horizontal} pane1InitSize={400}>

          <EditorGroup/>

          <div>
            <span>TODO.. console output screen</span>
            <div onClick={this.handleOnClick.bind(this)}>test</div>
          </div>

        </PaneWindow>

      </PaneWindow>
      </div>
    );
  }
}

App.propTypes = {
  props: PropTypes.shape({
    directoryTreeState: PropTypes.object.isRequired,
    sourceState: PropTypes.object.isRequired
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

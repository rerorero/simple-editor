'use strict';

import keyMirror from 'keymirror';
import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

export const paneTypes = keyMirror({
  vertical: null,
  horizontal: null
});

export class Pane extends Component {

  constructor(props) {
    super(props);
    this.state = {
      size: props.initSize ? props.initSize : null
    };
  }

  render() {
    const classes = ['pane', this.props.type];

    var style = {};
    if (this.state.size) {
      if (this.props.type === paneTypes.vertical) {
        style.width = this.state.size;
      } else {
        style.height = this.state.size;
        style.display = 'flex';
      }
      style.flex = 'none';
    }

    return (
      <div className={classes.join(' ')} style={style} id={this.props.id}>
        {this.props.children}
      </div>
    );
  }
}

Pane.propTypes = {
  type: PropTypes.string.isRequired,
  initSize: PropTypes.number,
  id: PropTypes.string
};


export class PaneWindow extends Component {

  constructor(props) {
    super(props);

    if (props.children.length !== 2)
      console.warn('PaneWindow should have two children.');

    this.state = {
      draggingPos: null
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }

  updateDraggingPos(pos) {
    this.setState(Object.assign({}, this.state, {draggingPos: pos}));
  }

  onMouseDown(event) {
    const pos = this.props.type === paneTypes.vertical ?
      event.clientX :
      event.clientY ;
    this.updateDraggingPos(pos);
  }

  onMouseMove(event) {
    const pos = this.state.draggingPos;

    if (pos === null)
      return;

    const ref = this.refs.pane1;
    const pane1 = ReactDom.findDOMNode(ref);
    if (pane1 === null)
      return;

    let size;
    if (this.props.type === paneTypes.vertical) {
      size = pane1.getBoundingClientRect().width - (this.state.draggingPos - event.clientX);
      this.updateDraggingPos(event.clientX);
    } else {
      size = pane1.getBoundingClientRect().height - (this.state.draggingPos - event.clientY);
      this.updateDraggingPos(event.clientY);
    }

    if (size > 0) {
      ref.setState(Object.assign({}, ref.state, {size}));
    }
  }

  onMouseUp() {
    this.updateDraggingPos(null);
  }

  render() {
    const classes = ['pane-window-' + this.props.type];
    const borderClasses = ['pane-border-' + this.props.type];

    var pane1prop = {}, pane2prop = {};
    if (this.props.paneProps) {
      pane1prop = Object.assign({}, this.props.paneProps.pane1);
      pane2prop = Object.assign({}, this.props.paneProps.pane2);
    }

    return (
      <div className={classes.join(' ')}>
        <Pane ref="pane1" key="pane1" type={this.props.type}
          initSize={this.props.pane1InitSize} {...pane1prop}>
          {this.props.children[0]}
        </Pane>

        <span
          ref="border"
          key="border"
          className={borderClasses.join(' ')}
          type={this.props.type}
          onMouseDown={this.onMouseDown.bind(this)} />

        <Pane ref="pane2" key="pane2" type={this.props.type} {...pane2prop}>
          {this.props.children[1]}
        </Pane>
      </div>
    );
  }
}

PaneWindow.propTypes = {
  type: PropTypes.string.isRequired,
  pane1InitSize: PropTypes.number,
  paneProps: PropTypes.shape({
    pane1: PropTypes.object,
    pane2: PropTypes.object
  })
};

/* global ace */
'use strict';

import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
import '../vendor/ace-1.2.1-noconflict/ace';
ace.config.set("basePath", "../vendor/ace-1.2.1-noconflict");

const defaultStyle = {
  fontSize: '14px !important',
  border: '1px solid lightgray',
  width: '100%',
  height: '100%'
};

const defaultOptions = {
  showInvisibles: true
};

class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      style: Object.assign({}, props.style, defaultStyle),
      options: Object.assign({}, props.options, defaultOptions),
      content: this.props.content,
    };
  }

  componentDidMount(){
    const node = ReactDom.findDOMNode(this.refs.root);
    const editor = ace.edit(node);
    editor.setTheme(this.props.theme);
    editor.getSession().setMode("ace/mode/scala");
    editor.setShowPrintMargin(false);
    Object.keys(this.state.options).forEach(key => {
      editor.setOption(key, this.state.options[key]);
    });
  }

  render() {
      return (
        <div ref="root" style={this.state.style}>
          {this.props.content}
        </div>
      );
  }
}

Editor.propTypes = {
  theme: PropTypes.string,
  options: PropTypes.object,
  style: PropTypes.object,
  content: PropTypes.string
};

Editor.defaultProps = {
  style: {},
  options: {},
  theme: 'ace/theme/solarized_light',
  content: `package main
object HelloWorld {
  def main(args: Array[String]) :Unit = {
  println("Hello World")
}`
};

export default Editor;

'use strict';

import React, {Component, PropTypes} from 'react';

class TreeNode extends Component {

  handleSelected(e) {
    this.props.onSelected(this.props.attr);
  }

  handleToggleChildrenShown(e) {
    const visible = !this.areChildrenVisible();
    this.props.onChildrenVisibleChanged(this.props.attr, visible);
  }

  areChildrenVisible() {
    return (this.props.childNodes !== null);
  }

  render() {
    let child;
    if (this.areChildrenVisible()) {
      const childItems = this.props.childNodes.map((node) => {
        return <TreeNode {...node} />;
      })
      child =
        <div className="tree-node-child">
          {childItems}
        </div>;
    }

    const arrowIcon = this.props.arrowIcon !== null ?
      <span className={'icon ' + this.props.arrowIcon}></span> :
      <span className="icon"></span>;

    return (
      <nav className="nav-group tree-node-group">
        <span className="nav-group-item tree-node-item"
          onClick={this.handleToggleChildrenShown.bind(this)}
          onDoubleClick={this.handleSelected.bind(this)}>
          {arrowIcon}
          <span className={'icon ' + this.props.icon}></span>
          {this.props.label}
        </span>
        {child}
      </nav>
    );
  }
}

TreeNode.propTypes = {
  label: PropTypes.string.isRequired,
  attr: PropTypes.any.isRequired,
  onSelected: PropTypes.func.isRequired,
  onChildrenVisibleChanged: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  arrowIcon: PropTypes.string,
  childNodes: PropTypes.array
};

export default TreeNode;

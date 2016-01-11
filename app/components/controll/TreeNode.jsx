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

    return (
      <div className="tree-node">
        <div className="tree-node-self">
          <span className="tree-node-icon" onClick={this.handleToggleChildrenShown.bind(this)}>
            {this.areChildrenVisible() ? this.props.icon.expanded : this.props.icon.contracted}
          </span>
          <span className="tree-node-label" onDoubleClick={this.handleSelected.bind(this)}>
            {this.props.label}
          </span>
        </div>
        {child}
      </div>
    );
  }
}

TreeNode.propTypes = {
  label: PropTypes.string.isRequired,
  attr: PropTypes.any.isRequired,
  onSelected: PropTypes.func.isRequired,
  onChildrenVisibleChanged: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  icon: PropTypes.shape({
    expanded: PropTypes.string.isRequired,
    contracted: PropTypes.string.isRequired
  }),
  childNodes: PropTypes.array
};

export default TreeNode;

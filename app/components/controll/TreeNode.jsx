'use strict';

import React, {Component, PropTypes} from 'react';

class TreeNode extends Component {

  handleSelected(e) {
    this.props.onSelected(this.props.attr);
  }

  handleToggleExpanded(e) {
    if (this.props.expanded) {
      this.props.onContract(this.props.attr);
    } else {
      this.props.onExpand(this.props.attr);
    }
  }

  render() {
    let child;
    if (this.props.expanded) {
      const childItem = (this.props.childNode !== null) ?
        <TreeNode {...this.props.childNode} /> :
        <span>(empty)</span>;
      child = (
        <div className="tree-node-child">
          {childItem}
        </div>
      );
    }

    return (
      <div className="tree-node">
        <div className="tree-node-self">
          <span className="tree-node-icon" onClick={this.handleToggleExpanded}>
            {this.props.expanded ? this.props.icon.expanded : this.props.icon.contracted}
          </span>
          <span className="tree-node-label" onDoubleClick={this.handleSelected}>
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
  onExpand: PropTypes.func.isRequired,
  onContract: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  icon: PropTypes.shape({
    expanded: PropTypes.string.isRequired,
    contracted: PropTypes.string.isRequired
  }),
  childNode: PropTypes.object
};

export default TreeNode;

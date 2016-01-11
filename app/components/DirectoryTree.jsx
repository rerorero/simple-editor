'use strict';

import React, {Component, PropTypes} from 'react';
import TreeNode from './controll/TreeNode';

function onNodeSelected(attr) {
  attr.actions.onTreeNodeSelected(attr.path, attr.rootPath);
}

function onNodeExpanded(attr) {
  attr.actions.onTreeNodeExpanded(attr.path, attr.rootPath);
}

function onNodeContracted(attr) {
  attr.actions.onTreeNodeContracted(attr.path, attr.rootPath);
}

function noop() {}

class DirectoryTree extends Component {

  mapDirTreeToNodeProps(dirNode, rootPath) {
    if (dirNode === null)
      return null;

    let icon;
    let onSelected;
    let onExpand;
    let onContract;

    if (dirNode.isDir) {
      icon = {
        expanded: '📂',
        contracted: '📁'
      };
      onSelected = noop,
      onExpand = onNodeExpanded,
      onContract = onNodeContracted,

    } else if (dirNode.isFile) {
      icon = {
        expanded: '📄',
        contracted: '📄'
      };
      onSelected = onNodeSelected,
      onExpand = noop,
      onContract = noop,

    } else {
      return null;
    }

    return {
      label: dirNode.name,
      attr: {
        actions: this.props.actions,
        path: dirNode.path,
        rootPath
      },
      onSelected,
      onExpand,
      onContract,
      expanded: dirNode.expended,
      icon,
      childNode: this.mapDirTreeToNodeProps(dirNode.child, rootPath)
    };
  }

  render() {
    const treeState = this.props.directoryTreeState;

    var rootPath = null;
    if (treeState !== null)
      rootPath = treeState.path;

    const nodePropTree = this.mapDirTreeToNodeProps(treeState);
    let treeNode = (nodePropTree !== null) ?
      <TreeNode {...nodePropTree} /> :
      <span>(Root not specified)</span>;

    return (
      <div className="directory-tree">
        {treeNode}
      </div>
    );
  }

}

DirectoryTree.propTypes = {
  directoryTreeState: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default DirectoryTree;

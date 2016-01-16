'use strict';

import React, {Component, PropTypes} from 'react';
import TreeNode from './controll/TreeNode';

function onNodeSelected(attr) {
  attr.actions.onTreeNodeSelected(attr.path, attr.rootPath);
}

function onNodeChildrenVisibleChanged(attr, visible) {
  attr.actions.onTreeNodeVisibleChildrenChanged(attr.path, attr.rootPath, visible);
}

function noop() {}

class DirectoryTree extends Component {

  mapDirTreeToNodeProps(dirNode) {
    if (dirNode === null)
      return null;

    let icon;
    let arrowIcon;
    let onSelected;
    let onChildrenVisibleChanged;

    if (dirNode.isDir()) {
      icon = 'icon-folder';
      arrowIcon = dirNode.children === null ? 'icon-right-open' : 'icon-down-open';
      onSelected = noop;
      onChildrenVisibleChanged = onNodeChildrenVisibleChanged;


    } else if (dirNode.isFile()) {
      icon = 'icon-doc-text';
      arrowIcon = null;
      onSelected = onNodeSelected;
      onChildrenVisibleChanged = noop;

    } else {
      return null;
    }

    const childNodes = dirNode.children === null ? null :
      dirNode.children.map((child) => {
        return this.mapDirTreeToNodeProps(child);
      });

    return {
      label: dirNode.name,
      attr: {
        actions: this.props.actions,
        path: dirNode.path,
        rootPath: dirNode.rootPath
      },
      onSelected,
      onChildrenVisibleChanged,
      icon,
      arrowIcon,
      childNodes
    };
  }

  render() {
    const nodePropTree = this.mapDirTreeToNodeProps(this.props.directoryTreeState);

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
  directoryTreeState: PropTypes.object, // DirTreeNode
  actions: PropTypes.object.isRequired
};

export default DirectoryTree;

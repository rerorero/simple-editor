'use strict';

import React, {Component, PropTypes} from 'react';
import TreeNode from './controll/TreeNode';

function onNodeSelected(attr) {
  attr.actions.onTreeNodeSelected(attr.path, attr.rootPath);
}

function onNodeChildrenVisibleChanged(attr, visible) {
  attr.actions.onTreeNodeChildrenVisibleChanged(attr.path, visible, attr.rootPath);
}

function noop() {}

class DirectoryTree extends Component {

  mapDirTreeToNodeProps(dirNode, rootPath) {
    if (dirNode === null)
      return null;

    let icon;
    let selectedHandler;
    let childrenVisibleHandler;

    if (dirNode.isDir) {
      icon = {
        expanded: '📂',
        contracted: '📁'
      };
      onSelected = noop;
      onChildrenVisibleChanged = onNodeChildrenVisibleChanged;

    } else if (dirNode.isFile) {
      icon = {
        expanded: '📄',
        contracted: '📄'
      };
      onSelected = onNodeSelected;
      onChildrenVisibleChanged = noop;

    } else {
      return null;
    }

    const childNodes = dirNode.children === null ? null :
      dirNode.children.map((child) => {
        return this.mapDirTreeToNodeProps(child, rootPath);
      });

    return {
      label: dirNode.name,
      attr: {
        actions: this.props.actions,
        path: dirNode.path,
        rootPath
      },
      onSelected,
      onChildrenVisibleChanged,
      icon,
      childNodes
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
  directoryTreeState: PropTypes.shape({
    isDir: PropTypes.bool.isRequired,
    isFile: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    children: PropTypes.array
  }),
  actions: PropTypes.object.isRequired
};

export default DirectoryTree;

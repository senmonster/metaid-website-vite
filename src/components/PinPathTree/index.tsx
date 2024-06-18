import { IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { Group, Tree, TreeNodeData, UseTreeReturnType } from '@mantine/core';
import IconPin from '@/assets/icon-tree-pin.svg?react';
import { data } from './TreeData';
import classes from './LeftTree.module.css';
import { useEffect } from 'react';

type Iprops = {
  tree: UseTreeReturnType;
};

interface FileIconProps {
  isFolder: boolean;
  expanded: boolean;
}

interface RenderTreeNodePayload {
  /** Node level in the tree */
  level: number;
  /** `true` if the node is expanded, applicable only for nodes with `children` */
  expanded: boolean;
  /** `true` if the node has non-empty `children` array */
  hasChildren: boolean;
  /** `true` if the node is selected */
  selected: boolean;
  /** Node data from the `data` prop of `Tree` */
  node: TreeNodeData;
  /** Props to spread into the root node element */
  elementProps: {
    className: string;
    style: React.CSSProperties;
    onClick: (event: React.MouseEvent) => void;
    'data-selected': boolean | undefined;
    'data-value': string;
    'data-hovered': boolean | undefined;
  };
  tree: UseTreeReturnType;
}

function FileIcon({ isFolder, expanded }: FileIconProps) {
  if (!isFolder) {
    return <IconPin />;
  }

  if (isFolder) {
    return (
      <div className='ml-2'>
        {expanded ? (
          <IconFolderOpen
            color='var(--mantine-color-yellow-9)'
            size={14}
            stroke={2.5}
          />
        ) : (
          <IconFolder
            color='var(--mantine-color-yellow-9)'
            size={14}
            stroke={2.5}
          />
        )}
      </div>
    );
  }

  return null;
}

function Leaf({
  node,
  expanded,
  hasChildren,
  elementProps,
  tree,
}: RenderTreeNodePayload) {
  return (
    <Group
      gap={5}
      {...elementProps}
      onClick={() => {
        if (!hasChildren || node.value == '/') {
          tree.setSelectedState([node.value]);
        }
        tree.setExpandedState({
          ...tree.expandedState,
          [node.value]: !expanded,
        });
      }}
    >
      <FileIcon isFolder={hasChildren} expanded={expanded} />
      <span>{node.label}</span>
    </Group>
  );
}

export default function PinPathTree({ tree }: Iprops) {
  useEffect(() => {
    tree.expandAllNodes();
  }, []);
  return (
    <Tree
      classNames={classes}
      selectOnClick={true}
      // clearSelectionOnOutsideClick
      data={data}
      tree={tree}
      renderNode={(payload) => <Leaf {...payload} tree={tree} />}
    />
  );
}

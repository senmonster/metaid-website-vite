import { TreeNodeData } from '@mantine/core';

export const data: TreeNodeData[] = [
  {
    label: 'Root',
    value: '/',
    children: [
      {
        label: 'Info',
        value: '/info',
        children: [
          { label: 'Name', value: '/info/name' },
          { label: 'Avatar', value: '/info/avatar' },
          { label: 'Bio', value: '/info/bio' },
        ],
      },
      {
        label: 'Protocols',
        value: '/protocols',
        children: [
          { label: 'Buzz', value: '/protocols/simplebuzz' },
          { label: 'Paylike', value: '/protocols/paylike' },
        ],
      },
      {
        label: 'File',
        value: '/file',
      },
      {
        label: 'Nft',
        value: '/nft',
      },
      {
        label: 'Ft',
        value: '/ft',
      },
      {
        label: 'Follow',
        value: '/follow',
      },
    ],
  },
];

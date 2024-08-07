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
          { label: 'PayLike', value: '/protocols/paylike' },
          { label: 'PayComment', value: '/protocols/paycomment' },
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
        children: [
          {
            label: 'MRC20',
            value: '/ft/mrc20',
            children: [
              { label: 'Mint', value: '/ft/mrc20/mint' },
              { label: 'Deploy', value: 'ft/mrc20/deploy' },
            ],
          },
        ],
      },
      {
        label: 'Follow',
        value: '/follow',
      },
    ],
  },
];

import { ActionIcon, NavLink } from '@mantine/core';

import classes from './Navbar.module.css';

import cls from 'classnames';
import { useLocation } from 'react-router-dom';
import { NavItem } from '../../types/nav-item';
import { Logo } from '../Logo/Logo';
import IconBrandGithub from '@/assets/icon-github.svg?react';
import IconBrandTwitter from '@/assets/icon-x.svg?react';
import IconBook from '@/assets/icon-book.svg?react';

import IconPin from '@/assets/icon-tree-pin.svg?react';
import IconMyPin from '@/assets/icon-my-pin.svg?react';
import IconMetaID from '@/assets/icon-metaid.svg?react';
import IconBlock from '@/assets/icon-block.svg?react';
import IconMempool from '@/assets/icon-mempool.svg?react';

import IconPinActive from '@/assets/icon-tree-pin-active.svg?react';
import IconMyPinActive from '@/assets/icon-my-pin-active.svg?react';
import IconMetaIDActive from '@/assets/icon-metaid-active.svg?react';
import IconBlockActive from '@/assets/icon-block-active.svg?react';
import IconMempoolActive from '@/assets/icon-mempool-active.svg?react';

interface Props {
  data: NavItem[];
  hidden?: boolean;
}

const reanderNavIcon = ({
  link,
  active,
}: {
  link: string;
  active: boolean;
}) => {
  switch (link) {
    case '/pin':
      return active ? (
        <IconPinActive className='w-5 h-5' />
      ) : (
        <IconPin className='w-5 h-5' />
      );
    case '/my-pin':
      return active ? (
        <IconMyPinActive className='w-5 h-5' />
      ) : (
        <IconMyPin className='w-5 h-5' />
      );

    case '/metaid':
      return active ? (
        <IconMetaIDActive className='w-5 h-5' />
      ) : (
        <IconMetaID className='w-5 h-5' />
      );

    case '/block':
      return active ? (
        <IconBlockActive className='w-5 h-5' />
      ) : (
        <IconBlock className='w-5 h-5' />
      );
    case '/mempool':
      return active ? (
        <IconMempoolActive className='w-5 h-5' />
      ) : (
        <IconMempool className='w-5 h-5' />
      );

    default:
      break;
  }
};

export function Navbar({ data }: Props) {
  const location = useLocation();
  const pathname = location.pathname;

  const links = data.map((item) => {
    // console.log("connected", connected, "item label", item.label, item.label === "My Pin");

    return (
      // <NavLinksGroup key={item.label}   {...item} />
      <div className='relative'>
        <NavLink
          className={cls('rounded-md px-6')}
          key={item.label}
          leftSection={reanderNavIcon({
            active: item.link === pathname,
            link: item.link!,
          })}
          href={item.link}
          variant='transparent'
          active={item.link === pathname}
          label={item.label}
          onClick={(e) => {
            if (item.label === 'MetaProtocol') {
              e.preventDefault();
              window.open(`https://metaprotocols.vercel.app/`, '_blank');
            }
          }}
          disabled={item.label === 'MetaProtocol'}
        />
        {item.link === pathname && (
          <div className='absolute right-[-24px] top-[13px] w-[4px] h-[14px] bg-main rounded-md'></div>
        )}
      </div>
    );
  });

  return (
    <div className='flex flex-col items-center py-6 justify-between h-full w-full'>
      <div className='flex flex-col items-center gap-0 w-full'>
        <Logo />
        <div
          className={cls(
            classes.linksInner,
            'flex flex-col gap-8 px-6 py-10 w-full'
          )}
        >
          {links}
        </div>
      </div>

      <div className='flex gap-6 items-center mb-6'>
        <ActionIcon
          size='sm'
          color='gray'
          variant='transparent'
          onClick={() => window.open('https://github.com/metaid-developers')}
        >
          <IconBrandGithub />
        </ActionIcon>
        <ActionIcon
          size='xs'
          color='gray'
          variant='transparent'
          onClick={() => window.open('https://twitter.com/metaidio')}
        >
          <IconBrandTwitter />
        </ActionIcon>
        <ActionIcon
          size='xs'
          color='gray'
          variant='transparent'
          onClick={() => window.open('https://doc.metaid.io/')}
        >
          <IconBook />
        </ActionIcon>
      </div>
    </div>
  );
}

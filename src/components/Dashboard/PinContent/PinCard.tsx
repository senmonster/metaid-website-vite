import React, { useEffect, useState } from 'react';
import {
  ActionIcon,
  Container,
  Divider,
  Skeleton,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';

import { isEmpty, isNil } from 'ramda';
import cls from 'classnames';
import { useNavigate } from 'react-router-dom';
import { IconHelp } from '@tabler/icons-react';
// import { IconDots, IconStar } from '@tabler/icons-react';
import { Pin } from '../../../utils/api';
import { BASE_URL } from '../../../utils/request';

type Iprops = {
  p?: Pin;
};

const PinCard = ({ p }: Iprops) => {
  const { colorScheme } = useMantineColorScheme();
  const [pData, setPData] = useState<Pin | null>(null);

  useEffect(() => {
    if (!isNil(p)) {
      setPData(p);
    }
  }, [p]);
  // const [netWork] = useState("testnet");
  //   const getNetWork = async () => {
  //     if (!isNil(window?.metaidwallet)) {
  //       setNetWork((await window.metaidwallet.getNetwork()).network);
  //     }
  //   };

  //   useEffect(() => {
  //     getNetWork();
  //   }, [netWork]);

  const navigate = useNavigate();

  const getPopComp = (level: number) => {
    let textColor;
    let bgColor;
    switch (level) {
      case 1:
        textColor = '#B6B6B6';
        bgColor = '#FFFFFF';
        break;
      case 2:
        textColor = '#838C9B';
        bgColor = 'linear-gradient(116deg, #FFFFFF 9%, #D6DFEB 92%)';
        break;
      case 3:
        textColor = '#515863';
        bgColor = 'linear-gradient(108deg, #D7E1EA 14%, #ACBDD4 101%)';
        break;
      case 4:
        textColor = '#516775';
        bgColor = 'linear-gradient(102deg, #DCEEFF 4%, #ACCBF1 89%)';
        break;
      case 5:
        textColor = '#5F5D87';
        bgColor = 'linear-gradient(105deg, #F0EFFF -2%, #D1CEFF 102%)';
        break;
      case 6:
        textColor = '#21D9A5';
        bgColor = 'linear-gradient(101deg, #F5FFFC -1%, #C9FFED 95%)';
        break;
      case 7:
        textColor = '#21AF86';
        bgColor = 'linear-gradient(105deg, #95FFDC 10%, #6DFFCE 100%)';
        break;
      case 8:
        textColor = '#054734';
        bgColor = 'linear-gradient(111deg, #8CFFD9 6%, #08EDAB 89%)';
        break;
      case 9:
        textColor = '#D1A65E';
        bgColor = 'linear-gradient(95deg, #FFFBF5 2%, #FFF9EE 97%)';
        break;
      case 10:
        textColor = '#AC8538';
        bgColor = 'linear-gradient(94deg, #FFF2E5 -5%, #FFE5B6 112%)';
        break;
      case 11:
        textColor = '#5C4A15';
        bgColor = 'linear-gradient(99deg, #FFF9EA -4%, #FCD789 103%)';
        break;
      case 12:
        textColor = '#3A2E0B';
        bgColor = 'linear-gradient(99deg, #FCE19E -4%, #FABC39 103%)';
        break;
      case 13:
        textColor = '#FFFFFF';
        bgColor = 'linear-gradient(102deg, #B837FD 2%, #D024A8 95%)';
        break;
      case 14:
        textColor = '#9B9B9B';
        bgColor = 'linear-gradient(109deg, #FC6780 5%, #FC3232 93%)';
        break;
      default:
        textColor = '#FFFFFF';
        bgColor = 'linear-gradient(116deg, #FFFFFF 9%, #D6DFEB 92%)';
    }
    return (
      <div className='grid place-content-center'>
        <div
          className={cls(
            `flex-1 h-5 w-[100px] grid place-content-center font-extrabold`
          )}
          style={{
            borderRadius: '4px 1px 4px 1px',
            background: bgColor,
            color: textColor,
          }}
        >
          {level === 0 ? '--' : `Lv${level}`}
        </div>
      </div>
    );
  };

  const popToolTip: React.ReactNode = (
    <div className='flex flex-col gap-3 text-wrap break-all'>
      <div>
        Lv(Level) represents the rarity level of the current pin, with higher
        levels being rarer.
      </div>
      {[...Array(14).keys()].map((i) => {
        return getPopComp(i);
      })}
    </div>
  );

  if (isNil(pData)) {
    return <Skeleton className='h-[258px] w-auto'></Skeleton>;
  }
  // console.log("pppp", pData);
  const content =
    pData.content.length <= 35
      ? pData.content
      : pData.content.slice(0, 35) + '...';
  // const cropSize = netWork === 'testnet' ? 18 : 26;
  // //   console.log('network', netWork);
  // //   console.log('cropSize', cropSize);
  // const pop = pData.pop.slice(cropSize).slice(0, 8);
  // const popArr = pop.split('');
  // const firstNonZeroIndex = popArr.findIndex((v) => v !== '0');
  // const reg = /^(?!0)\d+$/; // non zero regex
  // const level =
  //   pData.pop
  //     .slice(0, cropSize)
  //     .split('')
  //     .findIndex((v) => reg.test(v)) !== -1
  //     ? -1
  //     : firstNonZeroIndex === -1
  //     ? 8
  //     : firstNonZeroIndex;
  const cropSize = 18;
  const popArr = pData.pop.slice(cropSize).split('');
  const firstNonZeroIndex = popArr.findIndex((v) => v !== '0'); // number of zeroes

  const level = firstNonZeroIndex; // < 22 ? 0 : firstNonZeroIndex - 21;

  return (
    <div
      className={cls(
        'flex flex-col gap-2 border rounded-md p-4 cursor-pointer justify-between',
        {
          'border-[var(--mantine-color-dark-4)]': colorScheme === 'dark',
        }
      )}
      onClick={() => navigate(`/dashboard/pin-detail/${pData.id}`)}
    >
      <div className='flex items-center justify-between'>
        <Text className='text-[26px] text-gray-500' fw={700}>
          {'#' + pData.number}
        </Text>

        {isEmpty(pData.rootId) ? (
          <Text c='dimmed' size='xs'>
            Still In Mempool
          </Text>
        ) : (
          <Text c='dimmed' size='xs'>
            {pData.rootId.slice(0, 4) + '...' + pData.rootId.slice(-4)}
          </Text>
        )}
      </div>
      <Divider />
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 '>
          <Text size='sm' c='dimmed'>
            operation:
          </Text>
          <Text size='sm' c='dimmed'>
            {pData.operation}
          </Text>
        </div>
        <div className='flex gap-2'>
          <Text size='sm' c='dimmed'>
            path:
          </Text>
          <Text size='sm' c='dimmed' className='truncate'>
            {pData.path.length > 40
              ? `${pData.path.slice(0, 40)}...`
              : pData.path}
          </Text>
        </div>
        <div className='flex gap-2 items-center'>
          <Text size='sm' c='dimmed'>
            PoP:
          </Text>

          {/* <div
						className={cls(
							"p-1 px-2 rounded-md font-mono flex gap-2 text-[12px] h-6 w-[129.81px]",
							getPopColor(level)
						)}
					>
						{level === -1 ? (
							<div className="w-full text-center">junk</div>
						) : (
							pop.split("").map((n, index) => {
								return (
									<div className="w-full" key={index}>
										{n}
									</div>
								);
							})
						)}
					</div> */}

          <Tooltip
            label={pData.pop}
            classNames={{
              tooltip: 'bg-black text-white w-[300px] text-wrap break-all',
            }}
          >
            {getPopComp(level)}
          </Tooltip>

          {/* <Tooltip
            label={pData.pop}
            classNames={{
              tooltip: 'bg-black text-white w-[300px] text-wrap break-all',
            }}
          >
            <ActionIcon
              variant={'light'}
              color='gray'
              size='xs'
              aria-label='Settings'
            >
              <IconDots style={{ width: '70%', height: '70%' }} stroke={1.2} />
            </ActionIcon>
          </Tooltip> */}

          <Tooltip
            label={popToolTip}
            position='right'
            classNames={{ tooltip: 'bg-black text-white w-[300px] p-2' }}
          >
            <ActionIcon
              variant={'light'}
              color='gray'
              size='xs'
              aria-label='Settings'
            >
              <IconHelp style={{ width: '70%', height: '70%' }} stroke={1.2} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <Container
        h={100}
        w={'100%'}
        className={cls('rounded-md grid place-items-center bg-gray-200', {
          'bg-gray-500': colorScheme === 'dark',
        })}
      >
        {pData.type.includes('image') ? (
          <img
            src={BASE_URL + pData.content}
            alt='content image'
            width={50}
            height={50}
          />
        ) : (
          <Text className='break-words break-all text-wrap truncate'>
            {content}
          </Text>
        )}
      </Container>
    </div>
  );
};

export default PinCard;

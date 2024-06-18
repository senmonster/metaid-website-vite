import React from 'react';
import cls from 'classnames';
import {
  ActionIcon,
  Tooltip,
  Text,
  StyleProp,
  DefaultMantineColor,
  MantineSize,
} from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';

import { environment } from '../../utils/envrionments';

type Iprops = {
  rawPop: string;
  textSize?: MantineSize | undefined;
  textColor?: StyleProp<DefaultMantineColor> | undefined;
};

const PopCard = ({ rawPop, textSize, textColor }: Iprops) => {
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
            `flex-1 h-5 w-[40px] grid place-content-center font-extrabold`
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
      <div className='mb-3 break-keep'>
        Lv(Level) represents the rarity level of the current pin, with higher
        levels being rarer.
      </div>
      <div className='grid grid-rows-5 gap-2 grid-flow-col'>
        {[...Array(14).keys()].map((i) => {
          return <div key={i}>{getPopComp(i)}</div>;
        })}
      </div>
    </div>
  );

  const cropSize = environment.cropSize;

  const pop = rawPop.slice(cropSize).slice(0, 14);
  const popArr = pop.split('');
  const firstNonZeroIndex = popArr.findIndex((v) => v !== '0');
  const reg = /^(?!0)\d+$/; // non zero regex
  const level =
    rawPop
      .slice(0, cropSize)
      .split('')
      .findIndex((v: string) => reg.test(v)) !== -1
      ? 0
      : firstNonZeroIndex === -1
      ? 14
      : firstNonZeroIndex;

  return (
    <>
      <Tooltip
        label={rawPop}
        classNames={{
          tooltip: 'bg-black text-white w-[300px] text-wrap break-all',
        }}
      >
        <Text size={textSize} c={textColor}>
          {level === 0 ? '--' : pop}
        </Text>
      </Tooltip>

      {getPopComp(level)}

      <Tooltip
        label={popToolTip}
        position='right'
        classNames={{ tooltip: 'bg-black text-white w-[200px] p-6' }}
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
    </>
  );
};

export default PopCard;

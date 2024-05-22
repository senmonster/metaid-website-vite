import { useEffect, useState } from 'react';
import {
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
import { Pin } from '../../../utils/api';
import { useRecoilValue } from 'recoil';
import { networkAtom } from '../../../store/user';
import { MAN_BASE_URL_MAPPING } from '../../../utils/request';
import PopCard from '../../PopCard';
// test pincard
type Iprops = {
  p?: Pin;
  hidePop?: boolean;
};

const PinCard = ({ p, hidePop }: Iprops) => {
  const network = useRecoilValue(networkAtom);

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

  if (isNil(pData)) {
    return <Skeleton className='h-[258px] w-auto'></Skeleton>;
  }
  // console.log("pppp", pData);
  const content =
    pData.content.length <= 35
      ? pData.content
      : pData.content.slice(0, 35) + '...';

  return (
    <div
      className={cls(
        'flex flex-col gap-2 border rounded-md p-4 cursor-pointer justify-between',
        {
          'border-[var(--mantine-color-dark-4)]': colorScheme === 'dark',
        }
      )}
      onClick={() => navigate(`/pin-detail/${pData.id}`, { state: hidePop })}
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
          <Tooltip label={pData.metaid}>
            <Text c='dimmed' size='xs'>
              {pData.metaid.slice(0, 6)}
            </Text>
          </Tooltip>
        )}
      </div>
      <Divider />
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 '>
          <Text size='sm' c='dimmed'>
            Operation:
          </Text>
          <Text size='sm' c='dimmed'>
            {pData.operation}
          </Text>
        </div>
        <div className='flex gap-2'>
          <Text size='sm' c='dimmed'>
            Path:
          </Text>
          <Text size='sm' c='dimmed' className='truncate'>
            {pData.path.length > 40
              ? `${pData.path.slice(0, 40)}...`
              : pData.path}
          </Text>
        </div>
        {!hidePop && (
          <div className='flex gap-2 items-center'>
            <Text size='sm' c='dimmed'>
              PoP:
            </Text>
            <PopCard rawPop={pData.pop} textColor='dimmed' textSize='sm' />
          </div>
        )}
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
            src={MAN_BASE_URL_MAPPING[network] + pData.content}
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

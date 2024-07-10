import { useEffect, useState } from 'react';
import {
  Avatar,
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
import { PinDetail, metaidService } from '../../../utils/api';

import PopCard from '../../PopCard';
import { environment } from '../../../utils/envrionments';

import { useQuery } from '@tanstack/react-query';
type Iprops = {
  p?: PinDetail;
  hidePop?: boolean;
};

const PinCard = ({ p, hidePop }: Iprops) => {
  const { colorScheme } = useMantineColorScheme();
  const [pData, setPData] = useState<PinDetail | null>(null);
  useEffect(() => {
    if (!isNil(p)) {
      setPData(p);
    }
  }, [p]);

  const { data: currentUserInfo } = useQuery({
    enabled: !isEmpty(p?.metaid ?? ''),
    queryKey: ['metaidIfno', p?.metaid ?? ''],
    queryFn: () => metaidService.getMetaidInfo({ metaId: p?.metaid ?? '' }),
  });

  const navigate = useNavigate();

  if (isNil(pData)) {
    return <Skeleton className='h-[258px] w-auto'></Skeleton>;
  }
  // console.log("pppp", pData);
  const content =
    pData.content.length <= 35
      ? pData.content
      : pData.content.slice(0, 35) + '...';

  const imgSrc = environment.base_man_url + '/content/' + pData.id;
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

        <div className='flex gap-2 items-center'>
          <Avatar
            radius='xl'
            size={32}
            src={
              !isEmpty(currentUserInfo?.avatar ?? '')
                ? environment.base_man_url + currentUserInfo?.avatar
                : null
            }
            className='shadow-md cursor-pointer'
          >
            {(currentUserInfo?.name ?? '').slice(0, 2)}
          </Avatar>
          <Tooltip label={pData.metaid}>
            <Text c='dimmed' size='xs'>
              {pData.metaid.slice(0, 6)}
            </Text>
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className='flex flex-col gap-2 !text-[12px]'>
        <div className='flex gap-2 '>
          <Text size='xs' c='dimmed'>
            Operation:
          </Text>
          <Text size='xs' c='dimmed'>
            {pData.operation}
          </Text>
        </div>
        <div className='flex gap-2'>
          <Text size='xs' c='dimmed'>
            Path:
          </Text>
          <Text size='xs' c='dimmed' className='truncate'>
            {pData.path.length > 40
              ? `${pData.path.slice(0, 40)}...`
              : pData.path}
          </Text>
        </div>
        {!hidePop && (
          <div className='flex gap-2 items-center'>
            <Text size='xs' c='dimmed'>
              PoP:
            </Text>
            <PopCard rawPop={pData.pop} textColor='dimmed' textSize='xs' />
          </div>
        )}
      </div>

      <Container
        h={100}
        w={'100%'}
        className={cls('rounded-md grid place-items-center bg-gray-200', {
          '!bg-[#272523]': colorScheme === 'dark',
        })}
      >
        {pData.contentType.includes('image') ? (
          <img
            src={imgSrc}
            alt='content image'
            className='rounded-md object-cover max-w-[90%] max-h-[80px]'
            // width={50}
            // height={50}
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

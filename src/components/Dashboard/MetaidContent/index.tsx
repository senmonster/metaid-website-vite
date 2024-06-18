import { useState } from 'react';
import { divide, isEmpty, isNil, repeat } from 'ramda';
import {
  Avatar,
  Flex,
  NumberInput,
  Pagination,
  ScrollArea,
  Skeleton,
  useMantineColorScheme,
  Text,
  Tooltip,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { metaidService } from '../../../utils/api';
import { useDebouncedValue, usePagination } from '@mantine/hooks';
import cls from 'classnames';
// import { useNavigate } from "react-router-dom";

import { environment } from '../../../utils/envrionments';

const MetaidContent = () => {
  const [size, setSize] = useState<string | number>(30);
  const [debouncedSize] = useDebouncedValue(size, 800);

  const { data: CountData } = useQuery({
    queryKey: ['pin', 'list', 1],
    queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  });
  const total = Math.ceil(
    divide(
      CountData?.Count?.metaId ?? Number(debouncedSize),
      Number(debouncedSize)
    )
  );

  const pagination = usePagination({ total, initialPage: 1 });
  const { colorScheme } = useMantineColorScheme();
  // const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['metaidItem', 'list', pagination.active, Number(debouncedSize)],
    queryFn: () =>
      metaidService.getMetaidList({
        page: pagination.active,
        size: Number(debouncedSize),
      }),
  });
  return (
    <>
      {isError ? (
        'Server error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
            {repeat(1, Number(debouncedSize)).map((_, idx) => {
              return (
                <Skeleton visible={isLoading} key={idx}>
                  <div className='flex gap-2 border rounded-md p-4'>
                    <Avatar radius='xl' size={'lg'} src={null} />

                    <div className='flex flex-col'>
                      <div>{'mino'}</div>
                      <div>{'#12341234'}</div>
                    </div>
                  </div>
                </Skeleton>
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
              {(data?.list ?? []).map((m, index) => {
                return (
                  <div
                    key={index}
                    className={cls('flex gap-2 border rounded-md p-4', {
                      'border-[var(--mantine-color-dark-4)]':
                        colorScheme === 'dark',
                    })}
                    // onClick={() =>
                    // 	navigate(`/dashboard/pin-detail/${m.rootTxId + "i0"}`)
                    // }
                  >
                    <Avatar
                      radius='xl'
                      size={'lg'}
                      src={
                        !isEmpty(m?.avatar)
                          ? environment.base_man_url + m.avatar
                          : null
                      }
                    >
                      {m.name.slice(0, 1)}
                    </Avatar>
                    <div className='flex flex-col truncate'>
                      <div className='font-bold text-[18px] truncate'>
                        {isEmpty(m?.name) || isNil(m?.name)
                          ? `metaid-${m.metaid.slice(0, 4)}`
                          : m?.name}
                      </div>
                      <Tooltip label={m?.metaid}>
                        <div className='text-[12px] italic text-slate-400'>
                          {'#' + m?.metaid.slice(0, 6)}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <Flex
            className='absolute right-8 bottom-10'
            justify='center'
            align='center'
            direction='row'
            gap='lg'
          >
            <div className='flex gap-2 items-center'>
              <Text size='sm' c='dimmed'>
                Size Per Page
              </Text>
              <NumberInput
                className='w-[80px]'
                min={1}
                max={CountData?.Count?.metaId ?? Number(debouncedSize)}
                value={size}
                onChange={setSize}
              />
            </div>
            <Pagination
              total={total}
              value={pagination.active}
              onChange={pagination.setPage}
            />
          </Flex>
        </>
      )}
    </>
  );
};

export default MetaidContent;

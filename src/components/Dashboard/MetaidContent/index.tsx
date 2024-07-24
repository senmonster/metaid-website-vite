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
import { MetaidItem, metaidService } from '../../../utils/api';
import { useDebouncedValue, usePagination } from '@mantine/hooks';
import cls from 'classnames';
// import { useNavigate } from "react-router-dom";

import { environment } from '../../../utils/envrionments';

const MetaidContent = () => {
  const [size] = useState<string | number>(30);

  const { data: CountData } = useQuery({
    queryKey: ['pin', 'list'],
    queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  });
  const totalPage = Math.ceil(
    divide(CountData?.Count?.metaId ?? Number(size), Number(size))
  );

  const pagination = usePagination({ total: totalPage, initialPage: 1 });

  const [debouncedPageActive] = useDebouncedValue(pagination.active, 800);

  const { colorScheme } = useMantineColorScheme();
  // const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['metaidItem', 'list', debouncedPageActive],
    queryFn: () =>
      metaidService.getMetaidList({
        page: debouncedPageActive,
        size: Number(size),
      }),
  });
  const metaidData =
    environment.network === 'testnet' ? data?.list ?? [] : data?.list ?? [];
  return (
    <>
      {isError ? (
        'Server error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
            {repeat(1, Number(size)).map((_, idx) => {
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
              {!isEmpty(metaidData) ? (
                metaidData.map((m: MetaidItem, index: number) => {
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
                })
              ) : (
                <div>No metaid founded</div>
              )}
            </div>
          </ScrollArea>
          {!isEmpty(metaidData) && (
            <Flex
              className='absolute right-8 bottom-10'
              justify='center'
              align='center'
              direction='row'
              gap='lg'
            >
              <div className='gap-2 items-center lg:flex hidden'>
                <Text size='xs' c='dimmed'>
                  Page
                </Text>
                <NumberInput
                  className='w-[80px]'
                  min={1}
                  size='xs'
                  max={totalPage}
                  value={pagination.active}
                  onChange={(v) => pagination.setPage(Number(v))}
                />
              </div>
              <div className='phone:hidden block'>
                <Pagination
                  total={totalPage}
                  value={pagination.active}
                  onChange={pagination.setPage}
                  size={'xs'}
                />
              </div>
              <div className='phone:block hidden'>
                <Pagination
                  total={totalPage}
                  value={pagination.active}
                  onChange={pagination.setPage}
                  size={'sm'}
                />
              </div>
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default MetaidContent;

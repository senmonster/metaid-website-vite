import { Flex, NumberInput, Pagination, ScrollArea, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue, usePagination } from '@mantine/hooks';
import { divide, isEmpty, repeat } from 'ramda';
import PinCard from '../AllPinContent/PinCard';
import { useRecoilValue } from 'recoil';
import { walletRestoreParamsAtom } from '../../../store/user';
import { metaidService } from '../../../utils/api';
import { useState } from 'react';

type Iprops = {
  path: string;
};

const RightMyPinContent = ({ path }: Iprops) => {
  const walletParams = useRecoilValue(walletRestoreParamsAtom);

  const [size] = useState<string | number>(16);

  const { data: totalData } = useQuery({
    queryKey: ['mypin', 'list', path],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address: walletParams?.address ?? '',
        cursor: 0,
        size: 18,
        path: path === '/' ? undefined : path,
      }),
  });

  const totalPage = Math.ceil(divide(totalData?.total ?? 36, Number(size)));

  const pagination = usePagination({ total: totalPage, initialPage: 1 });

  const [debounceActivePage] = useDebouncedValue(pagination.active, 800);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['mypin', 'list', path, Number(debounceActivePage)],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address: walletParams?.address ?? '',
        cursor: debounceActivePage - 1,
        size: Number(size),
        path: path === '/' ? undefined : path,
      }),
  });

  const filterData = data?.list ?? [];
  return (
    <>
      {' '}
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
            {repeat(1, Number(18)).map((_, index) => {
              return <PinCard key={index} />;
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
              {isEmpty(filterData) ? (
                <div>{`No PIN data founded for path: ${path ?? '/'}.`}</div>
              ) : (
                filterData.map((p, index) => {
                  return (
                    <PinCard
                      key={index}
                      p={{
                        ...p,
                        content: ['file', '/info/avatar'].includes(p.path)
                          ? '/content/' + p.id
                          : p.contentSummary,
                      }}
                    />
                  );
                })
              )}
            </div>
          </ScrollArea>

          {!isEmpty(filterData) && (
            <Flex
              className='absolute right-8 bottom-[-46px]'
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

export default RightMyPinContent;

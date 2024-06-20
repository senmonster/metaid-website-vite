import { Flex, NumberInput, Pagination, ScrollArea, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue, usePagination } from '@mantine/hooks';
import { divide, isEmpty, repeat } from 'ramda';
import PinCard from '../AllPinContent/PinCard';
import { useRecoilValue } from 'recoil';
import { walletRestoreParamsAtom } from '../../../store/user';
import { metaidService } from '../../../utils/api';
import { useState, useMemo } from 'react';

type Iprops = {
  path: string;
};

const RightMyPinContent = ({ path }: Iprops) => {
  const walletParams = useRecoilValue(walletRestoreParamsAtom);

  const [size, setSize] = useState<string | number>(18);

  const [debouncedSize] = useDebouncedValue(size, 800);

  const { data: totalData } = useQuery({
    queryKey: ['mypin', 'list', '1', path],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address: walletParams?.address ?? '',
        cursor: 0,
        size: 1,
        path: path === '/' ? undefined : path,
      }),
  });

  const totalPage = useMemo(
    () => Math.ceil(divide(totalData?.total ?? 36, Number(debouncedSize))),
    [totalData?.total, debouncedSize]
  );

  const pagination = usePagination({ total: totalPage, initialPage: 1 });

  const { data, isError, isLoading } = useQuery({
    queryKey: ['mypin', 'list', pagination.active, Number(debouncedSize), path],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address: walletParams?.address ?? '',
        cursor: pagination.active - 1,
        size: Number(debouncedSize),
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
                <div>{`No PIN data founded for path: ${path}.`}</div>
              ) : (
                filterData.map((p, index) => {
                  return (
                    <PinCard
                      key={index}
                      p={{
                        ...p,
                        type: p.contentType,
                        height: 0,
                        content: p.contentType.includes('image')
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
                  Size
                </Text>
                <NumberInput
                  className='w-[80px]'
                  min={1}
                  size='xs'
                  max={totalData?.total ?? Number(size)}
                  value={size}
                  onChange={setSize}
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

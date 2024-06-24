import { useState } from 'react';
import {
  Center,
  Flex,
  Loader,
  NumberInput,
  Pagination,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue, usePagination } from '@mantine/hooks';
import { isNil, divide } from 'ramda';
import PinCard from '../AllPinContent/PinCard';
import { metaidService } from '../../../utils/api';

const BlockContent = () => {
  const [size] = useState<number>(18);

  const { data: CountData } = useQuery({
    queryKey: ['pin', 'list'],
    queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  });

  const totalPage = Math.ceil(
    divide(CountData?.Count?.Pin ?? Number(size), Number(size))
  );

  const pagination = usePagination({ total: totalPage, initialPage: 1 });

  const [debouncedPageActive] = useDebouncedValue(pagination.active, 800);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['block', 'list', debouncedPageActive],
    queryFn: () =>
      metaidService.getBlockList({
        page: pagination.active,
        size: Number(size),
      }),
  });

  return (
    <>
      {isError ? (
        'Server error'
      ) : isLoading ? (
        <Center className='h-[666px]'>
          <Loader type='bars' />
        </Center>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='flex flex-col gap-8 p-4'>
              {(data?.msgList ?? []).map((blockNumber) => {
                return (
                  <div key={blockNumber} className='flex items-center gap-4'>
                    <div className='font-bold text-2xl'>
                      {'#' + blockNumber}
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-5 flex-1 gap-2'>
                      {!isNil(data?.msgMap) &&
                        data?.msgMap[blockNumber].map((p, index) => {
                          return (
                            <PinCard
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              p={{ ...p, contentType: p.type } as any}
                              key={index}
                            />
                          );
                        })}
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
            <div className='gap-2 items-center lg:flex hidden'>
              <Text size='xs' c='dimmed'>
                Page
              </Text>
              <NumberInput
                className='w-[80px]'
                size='xs'
                min={1}
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
        </>
      )}
    </>
  );
};

export default BlockContent;

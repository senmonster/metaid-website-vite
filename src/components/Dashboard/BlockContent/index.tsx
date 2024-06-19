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
  const [size, setSize] = useState<string | number>(18);
  const [debouncedSize] = useDebouncedValue(size, 800);

  const { data: CountData } = useQuery({
    queryKey: ['pin', 'list', 1],
    queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  });
  const totalPage = Math.ceil(
    divide(
      CountData?.Count?.Pin ?? Number(debouncedSize),
      Number(debouncedSize)
    )
  );

  const pagination = usePagination({ total: totalPage, initialPage: 1 });

  const { data, isError, isLoading } = useQuery({
    queryKey: ['block', 'list', pagination.active, Number(debouncedSize)],
    queryFn: () =>
      metaidService.getBlockList({
        page: pagination.active,
        size: Number(debouncedSize),
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
                          return <PinCard p={p} key={index} />;
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
                Size
              </Text>
              <NumberInput
                className='w-[80px]'
                size='xs'
                min={1}
                max={CountData?.Count?.Pin ?? Number(size)}
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
        </>
      )}
    </>
  );
};

export default BlockContent;

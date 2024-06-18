import { useState } from 'react';
import { Flex, NumberInput, Pagination, ScrollArea, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue, usePagination } from '@mantine/hooks';
import PinCard from './PinCard';
import { divide, repeat } from 'ramda';
import { metaidService } from '../../../utils/api';

type Iprops = {
  path: string;
};

const RightAllPinContent = ({ path }: Iprops) => {
  ///////////////////////All Pin Data/////////////////////////////
  // const [size, setSize] = useState<string | number>(18);
  // const [debouncedSize] = useDebouncedValue(size, 800);

  // const { data: CountData } = useQuery({
  //   queryKey: ['pin', 'list', 1],
  //   queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  // });

  // const total = Math.ceil(
  //   divide(
  //     CountData?.Count?.Pin ?? Number(debouncedSize),
  //     Number(debouncedSize)
  //   )
  // );
  // const pagination = usePagination({ total, initialPage: 1 });

  // const {
  //   data: AllData,
  //   isError,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ['allpin', 'list', pagination.active, Number(debouncedSize)],
  //   queryFn: () =>
  //     metaidService.getPinList({
  //       page: pagination.active,
  //       size: Number(debouncedSize),
  //     }),
  // });

  ///////////////////////Path Pin Data//////////////////////////
  const [sizePath, setSizePath] = useState<string | number>(18);
  const [debouncedSizePath] = useDebouncedValue(sizePath, 800);

  const { data: totalData } = useQuery({
    enabled: path !== '/',
    queryKey: ['pin', 'list', path, 1],
    queryFn: () => metaidService.getPinListByPath({ page: 1, limit: 1, path }),
  });

  const totalPath = Math.ceil(
    divide(
      totalData?.total ?? Number(debouncedSizePath),
      Number(debouncedSizePath)
    )
  );
  const paginationPath = usePagination({ total: totalPath, initialPage: 1 });

  const {
    data: pathData,
    isError: isErrorPath,
    isLoading: isLoadingPath,
  } = useQuery({
    enabled: path !== '/',
    queryKey: [
      'pin',
      'list',
      path,
      paginationPath.active,
      Number(debouncedSizePath),
    ],
    queryFn: () =>
      metaidService.getPinListByPath({
        page: paginationPath.active,
        limit: Number(debouncedSizePath),
        path,
      }),
  });
  if (path !== '/') {
    return (
      <>
        {isErrorPath ? (
          'Server Error'
        ) : isLoadingPath ? (
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
              {repeat(1, Number(debouncedSizePath)).map((_, index) => {
                return <PinCard key={index} />;
              })}
            </div>
          </ScrollArea>
        ) : (
          <>
            <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
                {(pathData?.list ?? []).map((p, index) => {
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
                  max={totalData?.total ?? Number(debouncedSizePath)}
                  value={sizePath}
                  onChange={setSizePath}
                />
              </div>
              <Pagination
                total={totalPath}
                value={paginationPath.active}
                onChange={paginationPath.setPage}
              />
            </Flex>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
            {repeat(1, Number(debouncedSize)).map((_, index) => {
              return <PinCard key={index} />;
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
              {(AllData?.Pins ?? []).map((p, index) => {
                return <PinCard key={index} p={p} />;
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
                max={CountData?.Count?.Pin ?? Number(debouncedSize)}
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

export default RightAllPinContent;

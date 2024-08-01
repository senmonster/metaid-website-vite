import { useState } from 'react';
import { Flex, NumberInput, Pagination, ScrollArea, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue, usePagination } from '@mantine/hooks';
import PinCard from './PinCard';
import { divide, isEmpty, isNil, repeat } from 'ramda';
import { metaidService } from '../../../utils/api';

type Iprops = {
  path: string;
};

const RightAllPinContent = ({ path }: Iprops) => {
  ///////////////////////All Pin Data/////////////////////////////
  const [size] = useState<string | number>(16);

  const { data: CountData } = useQuery({
    enabled: isNil(path) || path === '/',
    queryKey: ['allpin', 'list'],
    queryFn: () => metaidService.getPinList({ page: 1, size: 1 }),
  });

  const totalPage = Math.ceil(
    divide(CountData?.Count?.Pin ?? Number(size), Number(size))
  );
  const pagination = usePagination({ total: totalPage, initialPage: 1 });
  const [deboucedActivePage] = useDebouncedValue(pagination.active, 800);

  const {
    data: AllData,
    isError,
    isLoading,
  } = useQuery({
    enabled: isNil(path) || path === '/',
    queryKey: ['allpin', 'list', deboucedActivePage],
    queryFn: () =>
      metaidService.getPinList({
        page: deboucedActivePage,
        size: Number(size),
      }),
  });

  ///////////////////////Path Pin Data//////////////////////////
  const [sizePath] = useState<string | number>(16);
  const { data: totalData } = useQuery({
    enabled: path !== '/' && !isNil(path),
    queryKey: ['pin', 'list', path],
    queryFn: () => metaidService.getPinListByPath({ page: 1, limit: 1, path }),
  });

  const totalPagePath = Math.ceil(
    divide(totalData?.total ?? Number(sizePath), Number(sizePath))
  );
  const paginationPath = usePagination({
    total: totalPagePath,
    initialPage: 1,
  });

  const [deboucedActivePagePath] = useDebouncedValue(
    paginationPath.active,
    800
  );

  const {
    data: pathData,
    isError: isErrorPath,
    isLoading: isLoadingPath,
  } = useQuery({
    enabled: path !== '/' && !isNil(path),
    queryKey: ['pin', 'list', path, deboucedActivePagePath],
    queryFn: () =>
      metaidService.getPinListByPath({
        page: deboucedActivePagePath,
        limit: Number(sizePath),
        path,
      }),
  });
  if (path !== '/' && !isNil(path)) {
    return (
      <>
        {isErrorPath ? (
          'Server Error'
        ) : isLoadingPath ? (
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
              {repeat(1, Number(sizePath)).map((_, index) => {
                return <PinCard key={index} />;
              })}
            </div>
          </ScrollArea>
        ) : (
          <>
            <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
              <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
                {isEmpty(pathData?.list ?? []) ? (
                  <div>{`No PIN data found for path: ${path}.`}</div>
                ) : (
                  (pathData?.list ?? []).map((p, index) => {
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

            {!isEmpty(pathData?.list ?? []) && (
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
                    size='xs'
                    className='w-[80px]'
                    min={1}
                    max={totalPagePath}
                    value={paginationPath.active}
                    onChange={(v) => paginationPath.setPage(Number(v))}
                  />
                </div>

                <div className='phone:hidden block'>
                  <Pagination
                    total={totalPagePath}
                    value={paginationPath.active}
                    onChange={paginationPath.setPage}
                    size={'xs'}
                  />
                </div>
                <div className='phone:block hidden'>
                  <Pagination
                    total={totalPagePath}
                    value={paginationPath.active}
                    onChange={paginationPath.setPage}
                    size={'sm'}
                  />
                </div>
              </Flex>
            )}
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
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
            {repeat(1, Number(size)).map((_, index) => {
              return <PinCard key={index} />;
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
              {!isEmpty(AllData?.Pins ?? []) ? (
                (AllData?.Pins ?? []).map((p, index) => {
                  return (
                    <PinCard
                      key={index}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      p={{ ...p, contentType: p.type } as any}
                    />
                  );
                })
              ) : (
                <div>No data found</div>
              )}
            </div>
          </ScrollArea>

          {!isEmpty(AllData?.Pins ?? []) && (
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

export default RightAllPinContent;

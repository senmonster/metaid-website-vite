import { metaidService } from '@/utils/api';
import { Flex, NumberInput, Pagination, ScrollArea, Text } from '@mantine/core';
import { useDebouncedValue, usePagination } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { divide, isEmpty, repeat } from 'ramda';
import PinCard from '../Dashboard/AllPinContent/PinCard';

type Iprops = {
  address: string;
};

const FeedTab = ({ address }: Iprops) => {
  const { data: totalData } = useQuery({
    enabled: !isEmpty(address),
    queryKey: ['userpin', 'list', address],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address: address,
        cursor: 0,
        size: 8,
      }),
  });

  const totalPage = Math.ceil(divide(totalData?.total ?? 8, 8));

  const pagination = usePagination({ total: totalPage, initialPage: 1 });
  const [debounceActivePage] = useDebouncedValue(pagination.active, 800);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['userpin', 'list', address, Number(debounceActivePage)],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address,
        cursor: debounceActivePage - 1,
        size: 8,
      }),
  });

  const filterData = data?.list ?? [];
  return (
    <div className='relative'>
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_402px)]' offsetScrollbars>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
            {repeat(1, Number(8)).map((_, index) => {
              return <PinCard key={index} />;
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_402px)]' offsetScrollbars>
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 p-2'>
              {isEmpty(filterData) ? (
                <div>{`No PIN data founded.`}</div>
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
              className='absolute right-8 bottom-[-30px]'
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
    </div>
  );
};

export default FeedTab;

import { MetaidItem, metaidService } from '@/utils/api';
import {
  Flex,
  Loader,
  NumberInput,
  Pagination,
  ScrollArea,
  Text,
} from '@mantine/core';
import { useDebouncedValue, usePagination } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { divide, isEmpty } from 'ramda';
import BuzzCard from './BuzzCard';

type Iprops = {
  address: string;
  currentUserInfo: MetaidItem | undefined;
};
const BuzzTab = ({ address, currentUserInfo }: Iprops) => {
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
    queryKey: ['user-buzz-pin', 'list', address, Number(debounceActivePage)],
    queryFn: () =>
      metaidService.getPinListByAddress({
        addressType: 'owner',
        address,
        cursor: debounceActivePage - 1,
        size: 8,
        path: '/protocols/simplebuzz,/protocols/banana',
      }),
  });

  const filterData = data?.list ?? [];

  return (
    <div className='relative'>
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          <ScrollArea className='h-[calc(100vh_-_402px)]' offsetScrollbars>
            <div className='flex flex-col mx-24 gap-4 p-2'>
              {isEmpty(filterData) ? (
                <div>{`No BUZZ data founded.`}</div>
              ) : (
                filterData.map((p) => {
                  return (
                    <BuzzCard
                      key={p.id}
                      pin={p}
                      currentUserInfo={currentUserInfo}
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

export default BuzzTab;

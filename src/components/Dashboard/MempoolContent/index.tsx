import { ScrollArea, Center } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { metaidService } from '../../../utils/api';
import { usePagination } from '@mantine/hooks';
import PinCard from '../AllPinContent/PinCard';
import { isNil, repeat } from 'ramda';

const MempoolContent = () => {
  const pagination = usePagination({ total: 10, initialPage: 1 });

  const { data, isError, isLoading } = useQuery({
    queryKey: ['mempoolPin', 'list', pagination.active],
    queryFn: () =>
      metaidService.getMempoolList({ page: pagination.active, size: 100 }),
  });

  return (
    <>
      {isError ? (
        'Server Error'
      ) : isLoading ? (
        <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
            {repeat(1, 18).map((_, index) => {
              return <PinCard key={index} />;
            })}
          </div>
        </ScrollArea>
      ) : (
        <>
          {isNil(data) ? (
            <Center className='h-[60vh]'>
              <div className='text-gray-300 text-[36px]'>
                Mempool is Empty now.
              </div>
            </Center>
          ) : (
            <>
              <ScrollArea className='h-[calc(100vh_-_210px)]' offsetScrollbars>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-2'>
                  {(data?.Pins ?? []).map((p, index) => {
                    return (
                      <PinCard
                        key={index}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        p={{ ...p, contentType: p.type } as any}
                        hidePop
                      />
                    );
                  })}
                </div>
              </ScrollArea>

              {/* <div className='phone:hidden block'>
                <Pagination
                  total={10}
                  value={pagination.active}
                  onChange={pagination.setPage}
                  size={'xs'}
                />
              </div>
              <div className='phone:block hidden'>
                <Pagination
                  total={10}
                  value={pagination.active}
                  onChange={pagination.setPage}
                  size={'sm'}
                />
              </div> */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default MempoolContent;

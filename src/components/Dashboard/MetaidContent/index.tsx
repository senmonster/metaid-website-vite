/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MetaidItem, metaidService } from '../../../utils/api';
import { useDebouncedValue, usePagination } from '@mantine/hooks';
import cls from 'classnames';
import { useNavigate } from 'react-router-dom';

import { environment } from '../../../utils/envrionments';
import FollowButton from '@/components/Buttons/FollowButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  btcConnectorAtom,
  connectedAtom,
  globalFeeRateAtom,
  myFollowingListAtom,
} from '@/store/user';
import { fetchFollowDetailPin, fetchFollowingList } from '@/utils/api';
import { toast } from 'react-toastify';
import { checkMetaletConnected, checkMetaletInstalled } from '@/utils/wallet';
const MetaidContent = () => {
  const [size] = useState<string | number>(30);
  const queryClient = useQueryClient();
  const connected = useRecoilValue(connectedAtom);
  const globalFeeRate = useRecoilValue(globalFeeRateAtom);

  const [myFollowingList, setMyFollowingList] =
    useRecoilState(myFollowingListAtom);
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
  const navigate = useNavigate();

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

  const btcConnector = useRecoilValue(btcConnectorAtom);

  const { data: myFollowingListData } = useQuery({
    queryKey: ['myFollowing', btcConnector?.metaid],
    enabled: !isEmpty(btcConnector?.metaid ?? ''),
    queryFn: () =>
      fetchFollowingList({
        metaid: btcConnector?.metaid ?? '',
        params: { cursor: '0', size: '100', followDetail: false },
      }),
  });

  const mutateFollowDetailData = useMutation({
    mutationFn: (metaid: string) =>
      fetchFollowDetailPin({
        metaId: metaid,
        followerMetaId: btcConnector?.metaid ?? '',
      }),
  });

  const handleFollow = async (metaidOfTrigger: string) => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);

    // const doc_modal = document.getElementById(
    //   'confirm_follow_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();
    const followDetailData = await mutateFollowDetailData.mutateAsync(
      metaidOfTrigger
    );
    if (
      !isNil(followDetailData) &&
      (myFollowingListData?.list ?? []).includes(metaidOfTrigger)
    ) {
      try {
        const unfollowRes = await btcConnector!.inscribe({
          inscribeDataArray: [
            {
              operation: 'revoke',
              path: `@${followDetailData.followPinId}`,
              contentType: 'text/plain;utf-8',
              flag: environment.flag,
            },
          ],
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeeRate),
          },
        });
        if (!isNil(unfollowRes?.revealTxIds[0])) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] });
          setMyFollowingList((d) => {
            return d.filter((i) => i !== metaidOfTrigger);
          });
          // await sleep(5000);
          toast.success(
            'Unfollowing successfully!Please wait for the transaction to be confirmed.'
          );
        }
      } catch (error) {
        console.log('error', error);
        const errorMessage = (error as any)?.message ?? error;
        const toastMessage = errorMessage?.includes(
          'Cannot read properties of undefined'
        )
          ? 'User Canceled'
          : errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(toastMessage, {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        });
      }
    } else {
      try {
        const followRes = await btcConnector!.inscribe({
          inscribeDataArray: [
            {
              operation: 'create',
              path: '/follow',
              body: metaidOfTrigger,
              contentType: 'text/plain;utf-8',

              flag: environment.flag,
            },
          ],
          options: {
            noBroadcast: 'no',
            feeRate: Number(globalFeeRate),
          },
        });
        if (!isNil(followRes?.revealTxIds[0])) {
          queryClient.invalidateQueries({ queryKey: ['buzzes'] });
          setMyFollowingList((d: string[]) => {
            return [...d, metaidOfTrigger];
          });
          // queryClient.invalidateQueries({
          //   queryKey: ['payLike', buzzItem!.id],
          // });
          // await sleep(5000);
          toast.success(
            'Follow successfully! Please wait for the transaction to be confirmed!'
          );
        }
      } catch (error) {
        console.log('error', error);
        const errorMessage = (error as any)?.message ?? error;
        const toastMessage = errorMessage?.includes(
          'Cannot read properties of undefined'
        )
          ? 'User Canceled'
          : errorMessage;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(toastMessage, {
          className:
            '!text-[#DE613F] !bg-[black] border border-[#DE613f] !rounded-lg',
        });
      }
    }
  };

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
                      className={cls(
                        'flex justify-between items-center border rounded-md p-4 cursor-pointer',
                        {
                          'border-[var(--mantine-color-dark-4)]':
                            colorScheme === 'dark',
                        }
                      )}
                      onClick={() => navigate(`/metaid-detail/${m.metaid}`)}
                    >
                      <div className='flex items-center gap-2'>
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
                        <div className='flex flex-col truncate self-center'>
                          <div className='font-bold text-[18px] truncate'>
                            {isEmpty(m?.name) || isNil(m?.name)
                              ? `metaid-${m.metaid.slice(0, 4)}`
                              : m?.name}
                          </div>
                          <Tooltip label={'MetaID:' + m?.metaid}>
                            <div className='text-[12px]  text-slate-400'>
                              {'MetaID:' + m?.metaid.slice(0, 6)}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                      {btcConnector?.metaid !== m?.metaid && (
                        <FollowButton
                          metaidOfTrigger={m?.metaid ?? ''}
                          isFollowed={(
                            myFollowingListData?.list ?? []
                          ).includes(m?.metaid)}
                          isFollowingPending={
                            (myFollowingList ?? []).includes(m?.metaid ?? '') &&
                            !(myFollowingListData?.list ?? []).includes(
                              m?.metaid
                            )
                          }
                          isUnfollowingPending={
                            !(myFollowingList ?? []).includes(
                              m?.metaid ?? ''
                            ) &&
                            (myFollowingListData?.list ?? []).includes(
                              m?.metaid
                            )
                          }
                          handleFollow={handleFollow}
                        />
                      )}
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

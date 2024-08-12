/* eslint-disable @typescript-eslint/no-explicit-any */
import { metaidInfoQueryOptions } from '@/queries/accout';
import {
  btcConnectorAtom,
  connectedAtom,
  globalFeeRateAtom,
  myFollowingListAtom,
} from '@/store/user';
import {
  fetchFollowDetailPin,
  fetchFollowerList,
  fetchFollowingList,
} from '@/utils/api';
import { environment } from '@/utils/envrionments';
import { Avatar, Divider, Skeleton, Tabs } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmpty, isNil } from 'ramda';
import { useRecoilState, useRecoilValue } from 'recoil';
import FollowButton from '../Buttons/FollowButton';
import { checkMetaletConnected, checkMetaletInstalled } from '@/utils/wallet';
import { toast } from 'react-toastify';
import FeedTab from './FeedTab';
import DetailTabClasses from './detail.module.css';
import BuzzTab from './BuzzTab';

type Iprops = {
  id: string;
};

const MetaidDetail = ({ id }: Iprops) => {
  const queryClient = useQueryClient();
  const connected = useRecoilValue(connectedAtom);
  const globalFeeRate = useRecoilValue(globalFeeRateAtom);

  const [myFollowingList, setMyFollowingList] =
    useRecoilState(myFollowingListAtom);

  const btcConnector = useRecoilValue(btcConnectorAtom);

  const { data: currentUserInfo, isLoading: isUserDataLoading } = useQuery({
    enabled: !isEmpty(id ?? ''),
    ...metaidInfoQueryOptions({ metaid: id ?? '' }),
  });

  const { data: myFollowingListData } = useQuery({
    queryKey: ['myFollowing', btcConnector?.metaid],
    enabled: !isEmpty(btcConnector?.metaid ?? ''),
    queryFn: () =>
      fetchFollowingList({
        metaid: btcConnector?.metaid ?? '',
        params: { cursor: '0', size: '100', followDetail: false },
      }),
  });
  const { data: followingListData } = useQuery({
    queryKey: ['following', currentUserInfo?.metaid],
    enabled: !isEmpty(currentUserInfo?.metaid ?? ''),
    queryFn: () =>
      fetchFollowingList({
        metaid: currentUserInfo?.metaid ?? '',
        params: { cursor: '0', size: '100', followDetail: false },
      }),
  });

  const { data: followerListData } = useQuery({
    queryKey: ['follower', currentUserInfo?.metaid],
    enabled: !isEmpty(currentUserInfo?.metaid ?? ''),
    queryFn: () =>
      fetchFollowerList({
        metaid: currentUserInfo?.metaid ?? '',
        params: { cursor: '0', size: '100', followDetail: false },
      }),
  });

  const { data: followDetailData } = useQuery({
    queryKey: ['followDetail', btcConnector?.metaid, currentUserInfo?.metaid],
    enabled:
      !isEmpty(btcConnector?.metaid ?? '') && !isEmpty(currentUserInfo?.metaid),
    queryFn: () =>
      fetchFollowDetailPin({
        metaId: currentUserInfo?.metaid ?? '',
        followerMetaId: btcConnector?.metaid ?? '',
      }),
  });
  const metaidPrefix = (currentUserInfo?.metaid ?? '').slice(0, 6);

  const handleFollow = async (metaidOfTrigger: string) => {
    await checkMetaletInstalled();
    await checkMetaletConnected(connected);

    // const doc_modal = document.getElementById(
    //   'confirm_follow_modal'
    // ) as HTMLDialogElement;
    // doc_modal.showModal();

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
            return [...d, currentUserInfo!.metaid];
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
    <div className='rounded-md  border-[0.5px] border-main  p-6 pb-10 px-10'>
      <div className='flex justify-between'>
        <div className='flex  gap-4 items-start '>
          {isUserDataLoading ? (
            <Skeleton height={80} circle />
          ) : (
            <Avatar
              radius='100%'
              size={'xl'}
              src={
                !isEmpty(currentUserInfo?.avatar ?? '')
                  ? environment.base_man_url + currentUserInfo?.avatar
                  : null
              }
            >
              {(currentUserInfo?.name ?? '').slice(0, 1)}
            </Avatar>
          )}
          <div className='flex flex-col gap-3 self-center'>
            {isUserDataLoading ? (
              <Skeleton height={36} width={150} />
            ) : (
              <div className='font-bold font-mono text-[12px] md:text-[24px] '>
                {!isEmpty(currentUserInfo?.name ?? '')
                  ? currentUserInfo?.name
                  : `MetaID-User-${metaidPrefix}`}
              </div>
            )}
            <div className='flex gap-2 text-[12px] md:text-[14px] '>
              <div>{`MetaID:  ${metaidPrefix}`}</div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-5 items-end self-end'>
          {btcConnector?.metaid !== currentUserInfo?.metaid && (
            <FollowButton
              isFollowed={(myFollowingListData?.list ?? []).includes(
                currentUserInfo?.metaid
              )}
              metaidOfTrigger={currentUserInfo?.metaid ?? ''}
              isFollowingPending={
                (myFollowingList ?? []).includes(
                  currentUserInfo?.metaid ?? ''
                ) &&
                !(myFollowingListData?.list ?? []).includes(
                  currentUserInfo?.metaid
                )
              }
              isUnfollowingPending={
                !(myFollowingList ?? []).includes(
                  currentUserInfo?.metaid ?? ''
                ) &&
                (myFollowingListData?.list ?? []).includes(
                  currentUserInfo?.metaid
                )
              }
              handleFollow={handleFollow}
            />
          )}

          <div
            className='flex self-center text-[12px] md:text-[14px] cursor-pointer'
            // onClick={() =>
            //   navigate(`/follow-detail/${currentUserInfo?.metaid}`)
            // }
          >
            <div className='flex gap-1'>
              <div className='text-main'>{followingListData?.total ?? 0}</div>
              <div className='text-[#B29372]'>Following</div>
            </div>
            <div className='border-r border-[#A4A59D] border mx-3'></div>
            <div className='flex gap-1'>
              <div className='text-main'>{followerListData?.total ?? 0}</div>
              <div className='text-[#B29372]'>Followers</div>
            </div>
          </div>
        </div>
      </div>
      <Divider my='md' />

      <Tabs
        variant='unstyled'
        classNames={DetailTabClasses}
        defaultValue='feed'
      >
        <Tabs.List className='mb-4'>
          <Tabs.Tab value='feed'>Feed</Tabs.Tab>
          <Tabs.Tab value='buzz'>Buzz</Tabs.Tab>
          <Tabs.Tab value='ft'>FT</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='feed'>
          <FeedTab address={currentUserInfo?.address ?? ''} />
        </Tabs.Panel>

        <Tabs.Panel value='ft'>
          <FeedTab
            address={currentUserInfo?.address ?? ''}
            path='/ft/mrc20/mint,/ft/mrc20/deploy'
          />
        </Tabs.Panel>

        <Tabs.Panel value='buzz'>
          <BuzzTab
            address={currentUserInfo?.address ?? ''}
            currentUserInfo={currentUserInfo}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default MetaidDetail;

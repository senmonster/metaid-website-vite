import cls from 'classnames';
import { IconChecks } from '@tabler/icons-react';
import { Button, Loader, MantineSize } from '@mantine/core';
type Iprops = {
  metaidOfTrigger: string;
  handleFollow: (metaidOfTrigger: string) => void;
  isFollowed: boolean;
  isFollowingPending: boolean;
  isUnfollowingPending: boolean;
  buttonSize?:
    | MantineSize
    | 'compact-xs'
    | 'compact-sm'
    | 'compact-md'
    | 'compact-lg'
    | 'compact-xl'
    | undefined;
};
const FollowButton = ({
  handleFollow,
  isFollowed,
  isFollowingPending,
  isUnfollowingPending,
  metaidOfTrigger,
  buttonSize,
}: Iprops) => {
  return (
    <div
      onClick={() => {
        if (isFollowingPending || isUnfollowingPending) {
          return;
        }
        handleFollow(metaidOfTrigger);
      }}
    >
      {isFollowed && !isFollowingPending && !isUnfollowingPending ? (
        <div className='btn btn-ghost btn-sm text-gray '>
          <IconChecks /> Followed
        </div>
      ) : (
        <Button
          size={buttonSize}
          variant='light'
          disabled={isFollowingPending || isUnfollowingPending}
          className={cls('flex items-center rounded-md ', {
            'cursor-not-allowed !bg-main/20 !border-none ':
              isFollowingPending || isUnfollowingPending,
          })}
          rightSection={
            (isFollowingPending || isUnfollowingPending) && (
              <Loader color='orange' type='dots' size={'xs'} />
            )
          }
        >
          {(isFollowingPending || isUnfollowingPending) && (
            <span className='loading loading-spinner loading-xs text-main/25'></span>
          )}
          {isFollowingPending ? (
            <span className='text-main/25'>Following</span>
          ) : isUnfollowingPending ? (
            <span className='text-main/25'>Unfollowing</span>
          ) : (
            'Follow'
          )}
        </Button>
      )}
    </div>
  );
};

export default FollowButton;

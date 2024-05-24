/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { isEmpty, isNil } from 'ramda';
import { image2Attach } from '../../../utils/file';
import { useClipboard } from '@mantine/hooks';

import CustomFeerate from './CustomFeerate';
import useImagesPreview from '../../../hooks/useImagesPreview';
import { IconCopy, IconCopyCheck } from '@tabler/icons-react';

import { Avatar, Button, Center, TextInput } from '@mantine/core';
import { UserInfo, globalFeeRateAtom } from '../../../store/user';
// import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { IBtcConnector } from '@metaid/metaid';
import { toast } from 'react-toastify';
import Decimal from 'decimal.js-light';
import { environment } from '../../../utils/envrionments';
export type FormUserInfo = {
  name: string;
  avatar: FileList;
  bio?: string;
};

export type MetaidUserInfo = {
  name: string;
  bio?: string;
  avatar?: string;
  feeRate?: number;
};

type IProps = {
  onSubmit: (userInfo: MetaidUserInfo) => void;
  btcConnector: IBtcConnector;
  address: string;
  balance: string;
  hasName: boolean;
  userInfo?: UserInfo;
};

const MetaidUserform = ({
  onSubmit,
  address,
  balance,
  hasName,
  userInfo,
  btcConnector,
}: IProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormUserInfo>({
    defaultValues: { name: userInfo?.name },
  });

  const avatar = watch('avatar');

  const globalFeerate = useRecoilValue(globalFeeRateAtom);

  const [filesPreview, setFilesPreview] = useImagesPreview(avatar);
  const onCreateSubmit: SubmitHandler<FormUserInfo> = async (data) => {
    const submitAvatar =
      !isNil(data?.avatar) && data.avatar.length !== 0
        ? await image2Attach(data.avatar)
        : [];

    const submitData = {
      ...data,
      avatar: !isEmpty(submitAvatar)
        ? Buffer.from(submitAvatar[0].data, 'hex').toString('base64')
        : undefined,
      bio: isEmpty(data?.bio ?? '') ? undefined : data?.bio,
      feeRate: globalFeerate,
    };
    console.log('submit profile data', submitData);
    onSubmit(submitData);
  };
  // console.log("avatar", avatar, !isEmpty(avatar));
  const clipboard = useClipboard({ timeout: 3000 });
  const clipboardForMetaid = useClipboard({ timeout: 3000 });
  return (
    <form
      autoComplete='off'
      onSubmit={handleSubmit(onCreateSubmit)}
      className='mt-2 flex flex-col gap-6'
    >
      <div className='flex flex-col gap-2 text-[12px] text-slate-400'>
        <div className='flex gap-6'>
          <div className='flex gap-2 items-center'>
            <div className=''>Your Address: </div>
            <div> {address.slice(0, 4) + '...' + address.slice(-4)}</div>
            {!clipboard.copied ? (
              <IconCopy
                className='cursor-pointer text-gray/30 hover:text-gray'
                onClick={() => clipboard.copy(address)}
                size={16}
              />
            ) : (
              <IconCopyCheck className='cursor-pointer text-main' size={16} />
            )}
          </div>
          <div className='flex gap-2'>
            <div>Your Balance: </div>
            <div> {new Decimal(balance).div(10 ** 8).toNumber()}</div>
            <div>btc</div>
          </div>

          <div className='flex gap-2 items-center'>
            <div className=''>MetaID: </div>
            <div>{'#' + btcConnector?.metaid?.slice(0, 6)}</div>
            {!clipboardForMetaid.copied ? (
              <IconCopy
                className='cursor-pointer text-gray/30 hover:text-gray'
                onClick={() => clipboardForMetaid.copy(userInfo?.metaid ?? '')}
                size={16}
              />
            ) : (
              <IconCopyCheck className='cursor-pointer text-main' size={16} />
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-8 mt-4'>
        <TextInput
          type='text'
          placeholder='Your name'
          {...register('name', { required: true })}
          error={errors.name && 'Username can not be empty.'}
        />

        <Controller
          control={control}
          name='avatar'
          render={({ field: { onChange } }) => (
            <input
              type='file'
              accept='.jpg,.jpeg,.png,.webp'
              id='addPFP'
              className='hidden'
              {...register('avatar')}
              onChange={(e) => {
                const maxFileSize = 200 * 1024; // max file size 200 kb
                const files = e.target.files;
                if (!isNil(files) && files[0].size > maxFileSize) {
                  toast.error('File size cannot be greater than 200kb');

                  setValue('avatar', [] as any); // clear file input value
                  e.target.value = ''; // clear file input value
                  return;
                }
                onChange(files);
              }}
            />
          )}
        />

        {hasName && (isNil(avatar) || avatar.length === 0) && (
          <Center>
            <Avatar
              radius='xl'
              size={'lg'}
              className='w-[100px] h-[100px] shadow-md rounded-full'
              src={
                !isEmpty(userInfo?.avatar)
                  ? environment.base_man_url + userInfo?.avatar
                  : null
              }
            >
              {(userInfo?.name ?? '').slice(0, 1)}
            </Avatar>
          </Center>
        )}

        {!isNil(avatar) && avatar.length !== 0 ? (
          <>
            <div className='bg-inheirt border border-dashed  border-[var(--mantine-primary-color-filled)] rounded-full w-[105px] h-[105px] grid place-items-center mx-auto'>
              <img
                height={100}
                width={100}
                className='w-[100px] h-[100px] object-cover self-center rounded-full'
                src={filesPreview[0]}
                alt=''
              />
            </div>
            <Button
              variant='light'
              onClick={() => {
                setFilesPreview([]);
                setValue('avatar', [] as any);
              }}
            >
              clear current uploads
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              document.getElementById('addPFP')!.click();
            }}
            variant='light'
          >
            {hasName ? 'Change Your Avatar' : 'Upload Your Avatar'}
          </Button>
        )}

        <CustomFeerate />
      </div>

      <Button variant='light' type='submit' className='mt-8'>
        Submit
      </Button>
    </form>
  );
};

export default MetaidUserform;

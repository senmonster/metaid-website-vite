/* eslint-disable no-mixed-spaces-and-tabs */
import { metaidService } from '../../utils/api';
import {
  Center,
  Loader,
  Text,
  Image,
  Button,
  Modal,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';

import dayjs from 'dayjs';
import PopCard from '../PopCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { environment } from '../../utils/envrionments';
import { IconTruckReturn } from '@tabler/icons-react';
type Iprops = {
  id: string;
};

const PinDetail = ({ id }: Iprops) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['pin', 'detail', id],
    queryFn: () => metaidService.getPinDetail({ id }),
  });
  const [viewMoreOpened, viewMoreHandler] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  return (
    <>
      {isError ? (
        'Server error'
      ) : isLoading ? (
        <Center className='h-[666px]'>
          <Loader type='bars' />
        </Center>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between items-center mb-4'>
            <Text className='text-main' size={'xl'}>
              {data?.contentTypeDetect}
            </Text>
            <Button
              leftSection={<IconTruckReturn size={22} />}
              size='sm'
              variant='outline'
              style={{
                border: 'none',
                borderRadius: '8px',
                boxShadow:
                  '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
              }}
              onClick={() => navigate(-1)}
            >
              Backup
            </Button>
          </div>
          {data?.operation ===
          'init' ? null : !data?.contentTypeDetect.includes('image') ? (
            <div className='flex flex-col gap-2'>
              <div
                className={
                  'rounded-md grid place-items-center overflow-hidden h-[200px] w-full px-[120px]'
                }
                style={{
                  background:
                    colorScheme === 'dark' ? 'rgb(19,15,11)' : '#FFF4E2',
                  boxShadow:
                    '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
                }}
              >
                <p
                  className='text-wrap break-all leading-relaxed
'
                >
                  {`${data?.contentSummary ?? ''}${
                    (data?.contentSummary ?? '').length > 1900 ? '...' : ''
                  }`}
                </p>
              </div>

              {(data?.contentSummary ?? '').length > 1900 && (
                <div
                  className={'rounded-md grid place-items-end w-full'}
                  style={{
                    background:
                      colorScheme === 'dark' ? 'rgb(19,15,11)' : '#FFF4E2',
                    boxShadow:
                      '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
                  }}
                >
                  <Button
                    onClick={viewMoreHandler.open}
                    variant='light'
                    size='xs'
                    className='mr-[-16px]'
                  >
                    View More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                background:
                  colorScheme === 'dark' ? 'rgb(19,15,11)' : '#FFF4E2',
                boxShadow:
                  '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
              }}
              className={
                'rounded-md grid place-items-center w-full h-[200px] px-[120px]'
              }
            >
              <Image
                className='rounded-md'
                src={data?.content}
                alt='image'
                h={100}
                w='auto'
                fit='contain'
                fallbackSrc={data?.content}
              />
            </div>
          )}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-44 gap-y-4'>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>ID:</Text>
              <Text className='break-all'>{data?.id}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>PoP:</Text>
              {!location.state ? (
                <div className='flex  items-center gap-4'>
                  <PopCard rawPop={data?.pop ?? ''} />
                </div>
              ) : (
                '-'
              )}
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>MetaID:</Text>
              <Text className='break-all'>{data?.metaid}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Operation:</Text>
              <Text>{data?.operation}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Address:</Text>
              <Text className='break-all'>{data?.address}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Path:</Text>
              <Text>{data?.path}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Original-Path:</Text>
              <Text>{data?.originalPath}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Version:</Text>
              <Text>{data?.version}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Encryption:</Text>
              <Text>{data?.encryption}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Output-Value:</Text>
              <Text>{data?.outputValue}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Preview:</Text>
              <Text
                className='break-all underline cursor-pointer'
                onClick={() => {
                  window.open(data?.preview, '_blank');
                }}
              >
                {data?.preview}
              </Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Content:</Text>
              <Text
                className='underline cursor-pointer break-all'
                onClick={() => {
                  window.open(data?.content, '_blank');
                }}
              >
                {data?.content}
              </Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Content-Length:</Text>
              <Text>{data?.contentLength}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Content-Type:</Text>
              <Text>{data?.contentType}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Time(UTC):</Text>
              <Text>
                {dayjs
                  .unix(data?.timestamp ?? dayjs().valueOf())
                  .format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Genesis-Height:</Text>
              <Text>{data?.genesisHeight}</Text>
            </div>
            <div className='flex flex-col gap-2 items-start'>
              <Text className='text-gray-600'>Genesis-Transaction:</Text>
              <Text
                className='cursor-pointer underline break-all'
                onClick={() => {
                  window.open(
                    `https://mempool.space/${
                      environment.network === 'mainnet' ? '' : 'testnet/'
                    }tx/${data?.genesisTransaction}`,
                    '_blank'
                  );
                }}
              >
                {data?.genesisTransaction}
              </Text>
            </div>
          </div>
        </div>
      )}
      <Modal opened={viewMoreOpened} onClose={viewMoreHandler.close} size='lg'>
        {data?.operation === 'init' ? null : !data?.contentTypeDetect.includes(
            'image'
          ) ? (
          <div className='flex flex-col gap-2'>
            <div
              style={{
                background:
                  colorScheme === 'dark' ? 'rgb(19,15,11)' : '#FFF4E2',
                boxShadow:
                  '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
              }}
              className={'rounded-md grid place-items-center px-[120px] w-full'}
            >
              <p className='break-all text-wrap'>
                {data?.contentSummary ?? ''}
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: colorScheme === 'dark' ? 'rgb(19,15,11)' : '#FFF4E2',
              boxShadow:
                '0px 1px 1px 0px rgba(103, 62, 19, 0.5),0px 0px 0px 1px #673E13',
            }}
            className={'rounded-md grid place-items-center px-[120px] w-full'}
          >
            <Image
              src={data?.content}
              alt='image'
              h={100}
              w='auto'
              fit='contain'
              fallbackSrc={data?.content}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default PinDetail;

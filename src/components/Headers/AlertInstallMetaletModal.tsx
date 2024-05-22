import { Button, Modal } from '@mantine/core';

type Iprops = {
  opened: boolean;
  handler: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
};

const AlertInstallMetaletModal = ({ opened, handler }: Iprops) => {
  return (
    <Modal opened={opened} onClose={handler.close} size='lg'>
      <div className='flex flex-col relative items-center'>
        <img src='/metalet-icon.png' className='w-[120px] h-[120px]' />
        <div className='text-white text-[24px] mt-6'>
          Download Metalet Wallet
        </div>
        <div className='flex flex-col items-center mt-12 gap-8'>
          <div className='flex flex-col gap-2'>
            <div className='font-medium text-gray w-full text-[16px] text-center'>
              You haven't installed the Metalet plugin wallet yet. Once
              installed successfully, please refresh the page or restart the
              browser and try again.{' '}
            </div>
            <div className='font-medium text-gray w-full text-[14px] text-center'>
              (Currently, it only supports the Metalet wallet.){' '}
            </div>
          </div>

          <Button
            variant='light'
            onClick={() => {
              window.open(
                `https://chromewebstore.google.com/search/metalet?hl=zh-CN&utm_source=ext_sidebar`,
                '_blank'
              );
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertInstallMetaletModal;

import { useTree } from '@mantine/core';
import PinPathTree from '../../PinPathTree';
import RightContent from './RightMyPinContent';

const MyPinContent = () => {
  const tree = useTree();

  const path = tree.selectedState[0];
  return (
    <div className='flex gap-2'>
      <div className='w-1/5 p-4'>
        <PinPathTree tree={tree} />
      </div>
      <div className='flex-1'>
        <RightContent path={path} />
      </div>
    </div>
  );
};

export default MyPinContent;

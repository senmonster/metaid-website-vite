import { useTree } from '@mantine/core';
import RightAllPinContent from './RightAllPinContent';
import PinPathTree from '@/components/PinPathTree';

const AllPinContent = () => {
  const tree = useTree();

  const path = tree.selectedState[0];

  return (
    <div className='flex gap-2'>
      <div className='w-1/5 p-4'>
        <PinPathTree tree={tree} />
      </div>
      <div className='flex-1'>
        <RightAllPinContent path={path} />
      </div>
    </div>
  );
};

export default AllPinContent;

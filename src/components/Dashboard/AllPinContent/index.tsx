import { useTree } from '@mantine/core';
import RightAllPinContent from './RightAllPinContent';
import PinPathTree from '@/components/PinPathTree';

const AllPinContent = () => {
  const tree = useTree();

  const path = tree.selectedState[0];

  return (
    <div className='relative gap-2 pl-[2px] phone:pl-[200px]'>
      <div className='absolute left-0 phone:w-[200px] p-4 hidden phone:block'>
        <PinPathTree tree={tree} />
      </div>
      <div className=''>
        <RightAllPinContent path={path} />
      </div>
    </div>
  );
};

export default AllPinContent;

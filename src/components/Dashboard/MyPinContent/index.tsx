import { useTree } from '@mantine/core';
import PinPathTree from '../../PinPathTree';
import RightMyPinContent from './RightMyPinContent';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { isNil } from 'ramda';

const MyPinContent = () => {
  const tree = useTree();
  const [searchParams] = useSearchParams();
  const path = searchParams.get('path');

  useEffect(() => {
    if (!isNil(path)) {
      tree.setSelectedState([path]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <div className='relative gap-2 pl-[2px] phone:pl-[200px]'>
      <div className='absolute left-0 phone:w-[200px] p-4 hidden phone:block'>
        <PinPathTree tree={tree} />
      </div>
      <div className=''>
        <RightMyPinContent path={tree.selectedState[0]} />
      </div>
    </div>
  );
};

export default MyPinContent;

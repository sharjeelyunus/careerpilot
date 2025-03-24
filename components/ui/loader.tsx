import React from 'react';

const SpinnerLoader = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='w-10 h-10 animate-spin rounded-full border-t-2 border-b-2 border-primary-100'></div>
    </div>
  );
};

export default SpinnerLoader;

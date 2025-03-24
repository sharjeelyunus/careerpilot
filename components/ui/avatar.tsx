'use client';

import React from 'react';
import Image from 'next/image';
import { auth } from '@/firebase/client';
import { signOut } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const Avatar = ({ image }: { image: string }) => {
  const handleSignOut = async () => {
    await signOut();
    await auth.signOut();
    redirect('/sign-in');
  };
  return (
    <Image
      src={image}
      alt='robot'
      height={32}
      width={32}
      className='rounded-full'
      onClick={handleSignOut}
    />
  );
};

export default Avatar;

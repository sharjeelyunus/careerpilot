import Avatar from '@/components/ui/avatar';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className='root-layout'>
      <nav className='flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' height={32} width={38} />
          <h2 className='text-primary-100'>CareerPilot</h2>
        </Link>
        {user?.id && <Avatar image={user?.photoURL || '/robot.png'} />}
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;

'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { auth } from '@/firebase/client';
import { getCurrentUser, signOut } from '@/lib/actions/auth.action';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import useSWR from 'swr';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const { data: user } = useSWR('current-user', getCurrentUser);

  const handleSignOut = async () => {
    await signOut();
    await auth.signOut();
    redirect('/sign-in');
  };

  return (
    <div className='root-layout'>
      <nav className='flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='logo' height={32} width={38} />
          <h2 className='text-primary-100'>CareerPilot</h2>
        </Link>
        {user?.id && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user?.photoURL} />
                    <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent className='p-4 md:w-[200px] lg:w-[200px]'>
                  <NavigationMenuLink onClick={() => redirect('/profile')}>
                    Profile
                  </NavigationMenuLink>
                  <NavigationMenuLink onClick={() => redirect('/leaderboard')}>
                    Leaderboard
                  </NavigationMenuLink>
                  <NavigationMenuLink onClick={handleSignOut}>
                    Sign Out
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;

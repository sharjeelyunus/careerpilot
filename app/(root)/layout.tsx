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
import React, { useEffect } from 'react';
import useSWR, { mutate } from 'swr';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useSWR('current-user', getCurrentUser, {
    revalidateOnFocus: false,
    dedupingInterval: 30 * 60 * 1000,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Revalidate all data when user logs in
        await mutate('current-user', undefined, { revalidate: true });
        await mutate(['user-interviews'], undefined, { revalidate: true });
        await mutate(['latest-interviews'], undefined, { revalidate: true });
        await mutate('filter-options', undefined, { revalidate: true });
      } else {
        // Clear all data when user logs out
        await mutate(() => true, undefined, { revalidate: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    await auth.signOut();
    await mutate(() => true, undefined, { revalidate: false });
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
                  <NavigationMenuLink
                    onClick={() => redirect(`/profile/${user?.id}`)}
                  >
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
}

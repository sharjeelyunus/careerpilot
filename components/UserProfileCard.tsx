import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, MapPin, Mail, User } from 'lucide-react';
import { UserProfileCardProps } from '@/types';
import useSWR from 'swr';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { motion } from 'framer-motion';

export function UserProfileCard({ profile, onEdit }: UserProfileCardProps) {
  const { data: user } = useSWR('current-user', getCurrentUser);

  const skills = user?.skills || [];
  const preferredRoles = user?.preferredRoles || [];

  const hasRequiredData =
    skills.length > 0 && user?.experience && preferredRoles.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full'
    >
      <Card className='w-full overflow-hidden rounded-2xl bg-gradient-to-br from-dark-300/80 to-dark-200/80 border border-primary-200/20 shadow-xl shadow-primary-200/5'>
        <div className='relative'>
          {/* Background elements */}
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
          <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-2xl' />
          <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/10 to-transparent blur-2xl' />

          {/* Header with gradient background */}
          <div className='relative h-32 bg-gradient-to-br from-dark-400 to-dark-300'>
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
            <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-xl' />

            {/* Edit button */}
            {user?.id === profile?.id && (
              <Button
                variant='outline'
                size='icon'
                onClick={onEdit}
                className='absolute top-4 right-4 z-20 bg-dark-300/50 border-primary-200/20 hover:bg-primary-200/10 hover:border-primary-200/30 backdrop-blur-sm'
              >
                <Edit2 className='h-4 w-4 text-primary-200' />
              </Button>
            )}

            {/* Avatar */}
            <div className='absolute -bottom-12 left-6 z-20'>
              <Avatar className='h-24 w-24 border-4 border-dark-300 shadow-lg ring-2 ring-primary-200/30'>
                <AvatarImage src={profile?.photoURL} />
                <AvatarFallback className='bg-primary-200/10 text-primary-200 text-xl'>
                  {profile?.name ? (
                    profile.name[0].toUpperCase()
                  ) : (
                    <User className='h-8 w-8' />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* User info */}
          <div className='relative pt-16 px-6 pb-4 z-20'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
              {profile?.name || 'Anonymous User'}
            </h3>
            <div className='flex flex-col gap-1 mt-2'>
              <div className='flex items-center gap-2 text-light-100/70'>
                <Mail className='h-4 w-4 text-primary-200' />
                <p className='text-sm'>{profile?.email}</p>
              </div>
              {profile?.location && (
                <div className='flex items-center gap-2 text-light-100/70'>
                  <MapPin className='h-4 w-4 text-primary-200' />
                  <p className='text-sm'>{profile.location}</p>
                </div>
              )}

              {/* Complete Profile Button */}
              {!hasRequiredData && user?.id === profile?.id && (
                <Button
                  variant='outline'
                  className='bg-primary-200/10 text-primary-200 border-primary-200/20 hover:bg-primary-200/20 transition-colors mt-4 relative z-20'
                  onClick={() => onEdit()}
                >
                  Complete Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        <CardContent className='relative z-10 pt-6 px-6 pb-8'>
          {profile?.bio && (
            <div className='mb-6 bg-dark-300/30 p-4 rounded-xl border border-primary-200/10 backdrop-blur-sm'>
              <h4 className='font-medium text-primary-200 mb-2 flex items-center gap-2'>
                <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                About
              </h4>
              <p className='text-sm text-light-100/80'>{profile.bio}</p>
            </div>
          )}

          {profile?.skills && profile.skills.length > 0 && (
            <div className='mb-6'>
              <h4 className='font-medium text-primary-200 mb-2 flex items-center gap-2'>
                <span className='w-1 h-4 bg-primary-200 rounded-full'></span>
                Skills
              </h4>
              <div className='flex flex-wrap gap-2'>
                {profile?.skills.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant='outline'
                    className='bg-primary-200/10 text-primary-200 border-primary-200/20 hover:bg-primary-200/20 transition-colors'
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

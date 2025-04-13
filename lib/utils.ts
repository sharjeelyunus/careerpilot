import { mappings } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { User, Interview, UserProgress, Badge, Achievement } from '@/types';
import { XPService } from '@/lib/services/xp.service';

dayjs.extend(isSameOrAfter);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, '').replace(/\s+/g, '');
  return mappings[key as keyof typeof mappings];
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : '/tech.svg',
    }))
  );

  return results;
};

export function calculateUserProgress(
  user: User | undefined,
  userInterviews: Interview[] | undefined
): UserProgress {
  const completedInterviews = userInterviews?.filter(
    (interview) => interview.feedbacks?.length
  ).length ?? 0;

  const averageScore = userInterviews?.length
    ? userInterviews.reduce((acc, interview) => {
        if (!interview.feedbacks?.length) return acc;
        
        const interviewScore = interview.feedbacks.reduce(
          (feedbackAcc, feedback) => feedbackAcc + feedback.totalScore,
          0
        ) / interview.feedbacks.length;
        
        return acc + interviewScore;
      }, 0) / completedInterviews
    : 0;

  const streak = user?.streak ?? 0;
  const badges = user?.badges ?? [];
  const achievements = user?.achievements ?? [];

  const xpService = XPService.getInstance();
  const experiencePoints = xpService.calculateXP(
    userInterviews ?? [],
    badges,
    achievements,
    streak
  );
  const level = xpService.calculateLevel(experiencePoints);

  return {
    userId: user?.id ?? '',
    totalInterviews: userInterviews?.length ?? 0,
    completedInterviews,
    averageScore,
    streak,
    badges: badges as Badge[],
    achievements: achievements.filter(
      (achievement: Achievement) => !achievement.completed && achievement.progress > 0
    ),
    level,
    experiencePoints,
  };
}

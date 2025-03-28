import { mappings } from '@/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ACHIEVEMENTS } from '@/constants/achievemnts';
import { BADGES } from '@/constants/badges';
import { User, Interview, UserProgress, Badge, Achievement } from '@/types';

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
  const completedInterviews =
    userInterviews?.filter((interview) => interview.feedback).length || 0;

  const totalScore =
    userInterviews?.reduce((acc, interview) => {
      return acc + (interview.feedback?.totalScore || 0);
    }, 0) || 0;

  const streak = (() => {
    if (!userInterviews || userInterviews.length === 0) return 0;

    const completed = userInterviews
      .filter((interview) => interview.feedback && interview.createdAt)
      .map((interview) => ({
        ...interview,
        date: dayjs(interview.createdAt),
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());

    let streakCount = 0;
    let currentDate = dayjs();

    for (const interview of completed) {
      if (interview.date.isSame(currentDate, 'day')) {
        streakCount++;
        currentDate = currentDate.subtract(1, 'day');
      } else {
        break;
      }
    }

    return streakCount;
  })();

  const achievements = ACHIEVEMENTS.map((achievement) => {
    const progress = achievement.getProgress(
      completedInterviews,
      userInterviews ?? []
    );
    const completed = achievement.isCompleted(
      completedInterviews,
      userInterviews ?? []
    );

    return {
      ...achievement,
      progress,
      completed,
    };
  });

  const badges =
    user?.badges && user.badges.length > 0
      ? BADGES.filter((badge) => user.badges.some((b) => b.id === badge.id))
      : (achievements
          .filter((a) => a.completed)
          .map((achievement) => {
            const matchedBadge = BADGES.find(
              (badge) =>
                badge.name === achievement.name ||
                badge.type === achievement.type
            );
            return matchedBadge || null;
          })
          .filter(Boolean) as unknown as Badge[]);

  const experiencePoints =
    completedInterviews * 100 +
    streak * 100 +
    badges.reduce((acc) => acc + 100, 0);

  const level = 1 + Math.floor(experiencePoints / 1000);

  return {
    userId: user?.id ?? '',
    totalInterviews: userInterviews?.length ?? 0,
    completedInterviews,
    averageScore: userInterviews?.length
      ? totalScore / userInterviews.length
      : 0,
    streak,
    badges: badges as Badge[],
    achievements: achievements.filter(
      (a) => !a.completed && a.progress > 0
    ) as Achievement[],
    level,
    experiencePoints: user?.experiencePoints ?? experiencePoints,
  };
}

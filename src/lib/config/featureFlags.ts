export const FEATURE_FLAGS = {
  TECHNICAL_CHALLENGES: process.env.NEXT_PUBLIC_ENABLE_TECHNICAL_CHALLENGES === 'true',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS; 
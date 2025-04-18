'use server';

import { auth, db } from '@/firebase/admin';
import { SignInParams, SignUpParams, User } from '@/types';
import { cookies } from 'next/headers';

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: 'Account created successfully. Please sign in.',
    };
  } catch (error: unknown) {
    console.error('Error creating a user:', error);

    if ((error as { code: string }).code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'This email is already in use. Please sign in instead.',
      };
    }

    return {
      success: false,
      message: 'Failed to create an account. Please try again later.',
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      console.log('User does not exist.');
      return {
        success: false,
        message: 'User does not exist. Please create an account instead.',
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'Signed in successfully.',
    };
  } catch (error: unknown) {
    console.error('Error signing in:', error);

    if ((error as { code?: string }).code === 'auth/invalid-id-token') {
      return {
        success: false,
        message: 'Invalid ID token. Please try again.',
      };
    }

    return {
      success: false,
      message: 'Failed to sign in. Please try again later.',
    };
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete('session');

  return {
    success: true,
    message: 'Signed out successfully.',
  };
}

export async function signInWithGoogle(params: {
  idToken: string;
  email: string;
  name: string;
  uid: string;
  photoURL: string | null;
}) {
  const { idToken, email, name, uid, photoURL } = params;

  try {
    const userRef = db.collection('users').doc(uid);
    const userRecord = await userRef.get();

    const userData = {
      name,
      email,
      photoURL,
    };

    if (!userRecord.exists) {
      await userRef.set(userData);
    } else {
      const existingData = userRecord.data();
      if (!existingData?.photoURL) {
        await userRef.update({ photoURL });
      }
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: 'Signed in with Google successfully.',
    };
  } catch (error) {
    console.error('Error handling Google sign-in:', error);
    return {
      success: false,
      message: 'Failed to authenticate with Google. Please try again.',
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days
  });

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

const _fetchUserFromDB = async (uid: string): Promise<User | null> => {
  const userRecord = await db.collection('users').doc(uid).get();
  if (!userRecord.exists) return null;

  return {
    ...userRecord.data(),
    id: userRecord.id,
  } as User;
};

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return await _fetchUserFromDB(decodedClaims.uid);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function getUserById(id: string): Promise<User | null> {
  const userRecord = await db.collection('users').doc(id).get();
  if (!userRecord.exists) return null;

  return {
    ...userRecord.data(),
    id: userRecord.id,
  } as User;
}

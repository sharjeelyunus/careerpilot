'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import FormField from './FormField';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase/client';
import { signIn, signInWithGoogle, signUp } from '@/lib/actions/auth.action';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';
import SpinnerLoader from './ui/loader';
import { mutate } from 'swr';
import { FormType } from '@/types';

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === 'sign-up') {
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          console.error('Firebase auth error:', error);
          throw new Error(error.message || 'Failed to create account');
        });

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result?.success) {
          toast.error(result?.message || 'Failed to create account');
          return;
        }

        toast.success('Account created successfully. Please sign in.');
        router.push('/sign-in');
      } else {
        const { email, password } = values;
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        ).catch((error) => {
          console.error('Firebase auth error:', error);
          throw new Error(error.message || 'Failed to sign in');
        });

        const idToken = await userCredentials.user.getIdToken();

        if (!idToken) {
          toast.error('Failed to sign in. Please try again later.');
          return;
        }

        const signInResult = await signIn({ email, idToken });
        
        if (!signInResult?.success) {
          toast.error(signInResult?.message || 'Failed to sign in');
          return;
        }

        toast.success('Signed in successfully.');
        await mutate('current-user', undefined, { revalidate: true });
        await mutate(['user-interviews'], undefined, { revalidate: true });
        await mutate(['latest-interviews'], undefined, { revalidate: true });
        await mutate('filter-options', undefined, { revalidate: true });
        router.push('/');
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignInWithGoogle = async () => {
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider).catch((error) => {
        if (error.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign in was cancelled');
        }
        throw error;
      });
      
      const idToken = await result.user.getIdToken();
      const response = await signInWithGoogle({
        idToken,
        email: result.user.email as string,
        name: result.user.displayName as string,
        uid: result.user.uid,
        photoURL: result.user.photoURL,
      });
      
      if (!response?.success) {
        toast.error(response?.message || 'Failed to sign in with Google');
        return;
      }
      
      toast.success('Signed in with Google successfully.');
      await mutate('current-user', undefined, { revalidate: true });
      await mutate(['user-interviews'], undefined, { revalidate: true });
      await mutate(['latest-interviews'], undefined, { revalidate: true });
      await mutate('filter-options', undefined, { revalidate: true });
      router.push('/');
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      if (errorMessage !== 'Sign in was cancelled') {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === 'sign-in';

  return (
    <div className='card-border lg:min-w-[566px]'>
      <div className='flex flex-col gap-6 card py-14 px-10'>
        <div className='flex flex-row gap-2 justify-center'>
          <Image src='/logo.svg' alt='logo' height={32} width={38} />
          <h2 className='text-primary-100'>CareerPilot</h2>
        </div>
        <h3 className='text-center'>Practice job interviews with AI</h3>

        {isLoading ? (
          <SpinnerLoader />
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full space-y-6 mt-4 form'
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name='name'
                  label='Name'
                  placeholder='Your Name'
                  autoComplete='name'
                />
              )}
              <FormField
                control={form.control}
                name='email'
                label='Email'
                placeholder='Your email address'
                type='email'
                autoComplete='email'
              />
              <FormField
                control={form.control}
                name='password'
                label='Password'
                placeholder='Enter your password'
                type='password'
                autoComplete={isSignIn ? 'current-password' : 'new-password'}
              />

              <Button className='btn' type='submit'>
                {isSignIn ? 'Sign in' : 'Create an Account'}
              </Button>

              <Button className='btn' onClick={handleSignInWithGoogle}>
                <FcGoogle />
                {isSignIn ? 'Sign in with Google' : 'Sign up with Google'}
              </Button>
            </form>
          </Form>
        )}

        <p className='text-center'>
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          <Link
            href={isSignIn ? '/sign-up' : '/sign-in'}
            className='font-bold text-user-primary ml-1'
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

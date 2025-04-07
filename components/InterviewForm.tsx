'use client';

import { Button } from './ui/button';
import { Form } from '@/components/ui/form';
import FormField from './FormField';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { generateInterview } from '@/lib/actions/general.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useState } from 'react';
import {
  Loader2,
  Briefcase,
  Code,
  Layers,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { motion } from 'framer-motion';

const formSchema = z.object({
  role: z.string().min(1, 'Job role is required'),
  type: z.enum(['technical', 'behavioral', 'mixed']),
  level: z.enum(['junior', 'mid', 'senior']),
  techstack: z.string().min(1, 'Tech stack is required'),
  amount: z.number().min(1).max(20),
});

const InterviewForm = () => {
  const { data: user } = useSWR('current-user', getCurrentUser);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      type: 'technical',
      level: 'junior',
      techstack: '',
      amount: 5,
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await generateInterview({
        role: values.role,
        type: values.type,
        level: values.level,
        techstack: values.techstack,
        amount: values.amount,
        userid: user?.id || '',
      });

      if (response.success) {
        if (response.interviewId) {
          router.push(`/interview/${response.interviewId}`);
        } else {
          router.push('/');
        }
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error('Error generating interview:', error);
      toast.error('Failed to generate interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-md mx-auto'
    >
      <div className='mb-3 text-center relative'>
        <div className='pt-8'>
          <h2 className='text-lg font-bold text-light-100 bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-primary-300'>
            Create Your Interview
          </h2>
          <p className='text-xs text-light-100/70 mt-0.5'>
            Fill in the details below to generate a personalized interview
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-3 form'
        >
          <Card className='bg-dark-200/50 border-primary-200/20 shadow-lg shadow-primary-200/5 backdrop-blur-sm'>
            <CardContent className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {/* Job Details Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className='space-y-2'
                >
                  <div className='flex items-center gap-1.5'>
                    <div className='w-6 h-6 rounded-full bg-primary-200/10 flex items-center justify-center'>
                      <Briefcase className='h-3.5 w-3.5 text-primary-200' />
                    </div>
                    <h3 className='text-xs font-medium text-light-100'>
                      Job Details
                    </h3>
                  </div>
                  <FormField
                    control={form.control}
                    name='role'
                    label='Job Role'
                    placeholder='e.g., Frontend Developer'
                  />
                  <FormField
                    control={form.control}
                    name='level'
                    label='Experience Level'
                    placeholder='Junior'
                    type='dropdown'
                    options={[
                      { label: 'Junior', value: 'junior' },
                      { label: 'Mid', value: 'mid' },
                      { label: 'Senior', value: 'senior' },
                    ]}
                  />
                </motion.div>

                {/* Technical Details Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className='space-y-2'
                >
                  <div className='flex items-center gap-1.5'>
                    <div className='w-6 h-6 rounded-full bg-primary-200/10 flex items-center justify-center'>
                      <Code className='h-3.5 w-3.5 text-primary-200' />
                    </div>
                    <h3 className='text-xs font-medium text-light-100'>
                      Technical Details
                    </h3>
                  </div>
                  <FormField
                    control={form.control}
                    name='techstack'
                    label='Tech Stack'
                    placeholder='e.g., React, Node.js'
                  />
                  <FormField
                    control={form.control}
                    name='type'
                    label='Interview Type'
                    placeholder='Technical'
                    type='dropdown'
                    options={[
                      { label: 'Technical', value: 'technical' },
                      { label: 'Behavioral', value: 'behavioral' },
                      { label: 'Mixed', value: 'mixed' },
                    ]}
                  />
                </motion.div>
              </div>

              {/* Interview Settings Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className='mt-3 pt-3 border-t border-primary-200/10'
              >
                <div className='flex items-center gap-1.5 mb-2'>
                  <div className='w-6 h-6 rounded-full bg-primary-200/10 flex items-center justify-center'>
                    <Zap className='h-3.5 w-3.5 text-primary-200' />
                  </div>
                  <h3 className='text-xs font-medium text-light-100'>
                    Interview Settings
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='w-4 h-4 rounded-full bg-primary-200/5 flex items-center justify-center cursor-help'>
                          <HelpCircle className='h-2.5 w-2.5 text-light-100/50' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='max-w-xs text-xs'>
                          Choose how many questions you want in your interview.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormField
                  control={form.control}
                  name='amount'
                  label='Number of Questions'
                  type='number'
                  placeholder='5'
                />
              </motion.div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button
              type='submit'
              className='btn-primary w-full h-10 text-sm font-medium shadow-lg shadow-primary-200/10 hover:shadow-primary-200/20 transition-all duration-300'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Generating Interview...
                </>
              ) : (
                'Generate Interview'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className='flex items-center justify-center my-3'
      >
        <div className='h-px bg-primary-200/20 flex-grow'></div>
        <span className='px-2 text-light-100/50 text-xs'>or</span>
        <div className='h-px bg-primary-200/20 flex-grow'></div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Button
          asChild
          className='btn-secondary w-full h-10 text-sm font-medium'
        >
          <Link
            href={user?.id ? '/interview' : 'sign-in'}
            className='flex items-center justify-center gap-2'
          >
            <Layers className='h-4 w-4' />
            Start a call with an AI
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default InterviewForm;

'use client';

import { Button } from './ui/button';
import { Form } from '@/components/ui/form';
import FormField from './FormField';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { generateInterview } from '@/lib/actions/general.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { Loader2, Briefcase, Code, Zap, HelpCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { motion } from 'framer-motion';

const formSchema = z.object({
  role: z.string()
    .min(1, 'Job role is required')
    .max(50, 'Job role cannot exceed 50 characters'),
  type: z.enum(['technical', 'behavioral', 'mixed'], {
    required_error: 'Please select an interview type',
  }),
  level: z.enum(['junior', 'mid', 'senior'], {
    required_error: 'Please select an experience level',
  }),
  techstack: z.string()
    .min(1, 'Tech stack is required')
    .max(100, 'Tech stack cannot exceed 100 characters'),
  amount: z.number({
    required_error: 'Number of questions is required',
    invalid_type_error: 'Number of questions must be a number',
  })
    .int('Number of questions must be a whole number')
    .min(1, 'Minimum 1 question required')
    .max(20, 'Maximum 20 questions allowed'),
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
        role: values.role.trim(),
        type: values.type,
        level: values.level,
        techstack: values.techstack.trim(),
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

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user?.id) {
      toast.error('Please log in to create an interview');
      router.push('/sign-in');
    }
  }, [user, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-xl mx-auto'
    >
      <div className='mb-4 text-center'>
        <h2 className='text-xl font-bold text-light-100 bg-clip-text text-transparent bg-gradient-to-r from-primary-200 to-primary-300'>
          Create Your Interview
        </h2>
        <p className='text-sm text-light-100/70 mt-1'>
          Fill in the details below to generate a personalized interview
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-3 form'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
        >
          <Card className='bg-dark-200/50 border-primary-200/20 shadow-lg shadow-primary-200/5 backdrop-blur-sm'>
            <CardContent className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Job Details Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className='space-y-3'
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-7 h-7 rounded-full bg-primary-200/10 flex items-center justify-center'>
                      <Briefcase className='h-4 w-4 text-primary-200' />
                    </div>
                    <h3 className='text-sm font-medium text-light-100'>
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
                    placeholder='Select level'
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
                  className='space-y-3'
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-7 h-7 rounded-full bg-primary-200/10 flex items-center justify-center'>
                      <Code className='h-4 w-4 text-primary-200' />
                    </div>
                    <h3 className='text-sm font-medium text-light-100'>
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
                    placeholder='Select type'
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
                className='mt-4 pt-4 border-t border-primary-200/10'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-7 h-7 rounded-full bg-primary-200/10 flex items-center justify-center'>
                    <Zap className='h-4 w-4 text-primary-200' />
                  </div>
                  <h3 className='text-sm font-medium text-light-100'>
                    Interview Settings
                  </h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='w-5 h-5 rounded-full bg-primary-200/5 flex items-center justify-center cursor-help ml-1'>
                          <HelpCircle className='h-3 w-3 text-light-100/50' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='max-w-xs text-xs'>
                          Choose between 1-20 questions for your interview.
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
                  min={1}
                  max={20}
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
              className='btn-primary w-full h-11 text-sm font-medium shadow-lg shadow-primary-200/10 hover:shadow-primary-200/20 transition-all duration-300'
              disabled={isLoading || !user?.id}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Generating Interview...
                </>
              ) : !user?.id ? (
                'Please log in to continue'
              ) : (
                'Generate Interview'
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
};

export default InterviewForm;

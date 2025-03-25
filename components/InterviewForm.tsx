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

const formSchema = z.object({
  role: z.string().min(1),
  type: z.enum(['technical', 'behavioral', 'mixed']),
  level: z.enum(['junior', 'mid', 'senior']),
  techstack: z.string().min(1),
  amount: z.number().min(1),
});

const InterviewForm = () => {
  const { data: user } = useSWR('current-user', getCurrentUser);

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
    const response = await generateInterview({
      role: values.role,
      type: values.type,
      level: values.level,
      techstack: values.techstack,
      amount: values.amount,
      userid: user?.id || '',
    });

    if (response.success) {
      router.push(`/interview/${response.interviewId}`);
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-full flex flex-col gap-4 mt-4 form'
        >
          <FormField
            control={form.control}
            name='role'
            label='Role'
            placeholder='Software Engineer'
          />
          <FormField
            control={form.control}
            name='type'
            label='Type'
            placeholder='Technical'
            type='dropdown'
            options={[
              { label: 'Technical', value: 'technical' },
              { label: 'Behavioral', value: 'behavioral' },
              { label: 'Mixed', value: 'mixed' },
            ]}
          />
          <FormField
            control={form.control}
            name='techstack'
            label='Techstack'
            placeholder='React, Node.js, MongoDB'
          />
          <FormField
            control={form.control}
            name='level'
            label='Level'
            placeholder='Junior'
            type='dropdown'
            options={[
              { label: 'Junior', value: 'junior' },
              { label: 'Mid', value: 'mid' },
              { label: 'Senior', value: 'senior' },
            ]}
          />
          <FormField
            control={form.control}
            name='amount'
            label='Amount'
            type='number'
            placeholder='1'
          />
          <Button type='submit' className='btn-primary w-full'>
            Generate Interview
          </Button>
        </form>
      </Form>
      <div className='flex justify-center'>----------- or ------------</div>
      <Button asChild className='btn-primary w-full'>
        <Link href={user?.id ? '/interview' : 'sign-in'}>
          Start a call with an AI
        </Link>
      </Button>
    </>
  );
};

export default InterviewForm;

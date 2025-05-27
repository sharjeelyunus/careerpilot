'use client';

import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Code,
  MessageSquare,
  Zap,
  BarChart,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Award,
  Rocket,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-br from-dark-300 to-dark-100 rounded-3xl p-8 md:p-16 mb-16'>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/20 to-transparent blur-3xl' />
        <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/20 to-transparent blur-3xl' />

        {/* Animated background elements */}
        <div className='absolute top-20 left-20 w-64 h-64 bg-primary-200/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-20 right-20 w-64 h-64 bg-primary-200/10 rounded-full blur-3xl animate-pulse delay-1000' />
        <div className='absolute top-1/2 left-1/2 w-32 h-32 bg-primary-200/10 rounded-full blur-3xl animate-pulse delay-500' />

        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-12'>
          <motion.div
            className='flex flex-col gap-8 max-w-2xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-primary-200/10 rounded-full text-primary-200 text-sm font-medium'>
              <Zap className='w-4 h-4' />
              <span>AI-Powered Interview Practice</span>
            </div>

            <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-200 via-light-100 to-primary-200 bg-clip-text text-transparent'>
              Master Your Interview Skills with AI
            </h1>

            <p className='text-lg md:text-xl text-light-100/90 leading-relaxed'>
              Get interview-ready with our AI-powered platform. Practice
              technical and behavioral interviews, receive instant feedback, and
              improve your skills at your own pace.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <Button asChild className='btn-primary text-lg px-8 py-6 group'>
                <Link href='/sign-in' className='flex items-center gap-2'>
                  Start Practicing Now
                  <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
                </Link>
              </Button>
            </div>

            <div className='flex items-center gap-6 mt-4'>
              <div className='flex -space-x-2'>
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className='w-10 h-10 rounded-full border-2 border-dark-200 overflow-hidden'
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      src={`/avatars/avatar-${i}.png`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className='object-cover'
                    />
                  </motion.div>
                ))}
              </div>
              <div className='text-sm text-light-100/70'>
                <span className='font-bold text-primary-200'>
                  Join our community
                </span>{' '}
                of aspiring professionals
              </div>
            </div>
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-primary-200/30 to-transparent blur-3xl' />
            <div className='relative z-10'>
              <div className='absolute -top-6 -right-6 w-24 h-24 bg-primary-200/20 rounded-full blur-xl animate-pulse' />
              <div className='absolute -bottom-6 -left-6 w-24 h-24 bg-primary-200/20 rounded-full blur-xl animate-pulse delay-300' />
              <Image
                src='/robot.png'
                alt='AI Interview Assistant'
                height={500}
                width={500}
                className='relative z-10 animate-float'
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='mb-20'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Why Choose CareerPilot
          </h2>
          <p className='text-light-100/70 max-w-2xl mx-auto'>
            Our AI-powered platform helps you prepare for interviews with
            personalized feedback and real-world scenarios.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {[
            {
              icon: <MessageSquare className='w-10 h-10 text-primary-200' />,
              title: 'Realistic Conversations',
              description:
                'Practice with AI that simulates real interviewers and adapts to your responses.',
            },
            {
              icon: <Code className='w-10 h-10 text-primary-200' />,
              title: 'Technical Challenges',
              description:
                'Tackle coding problems and system design questions with instant feedback.',
            },
            {
              icon: <CheckCircle className='w-10 h-10 text-primary-200' />,
              title: 'Detailed Feedback',
              description:
                'Get comprehensive feedback on your answers, communication, and technical skills.',
            },
            {
              icon: <BarChart className='w-10 h-10 text-primary-200' />,
              title: 'Track Progress',
              description:
                'Monitor your improvement over time with detailed analytics and performance metrics.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className='bg-dark-200/50 rounded-2xl p-8 border border-primary-200/10 hover:border-primary-200/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/5'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className='mb-6'>{feature.icon}</div>
              <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
              <p className='text-light-100/70'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className='mb-20'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>How It Works</h2>
          <p className='text-light-100/70 max-w-2xl mx-auto'>
            Get started with CareerPilot in three simple steps.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              step: '1',
              title: 'Choose Your Interview',
              description:
                'Select from a variety of interview types, difficulty levels, and tech stacks.',
              icon: <Sparkles className='w-6 h-6 text-primary-200' />,
            },
            {
              step: '2',
              title: 'Practice with AI',
              description:
                'Engage in realistic conversations with our AI interviewer that adapts to your responses.',
              icon: <MessageSquare className='w-6 h-6 text-primary-200' />,
            },
            {
              step: '3',
              title: 'Get Detailed Feedback',
              description:
                'Receive comprehensive feedback on your performance and areas for improvement.',
              icon: <CheckCircle className='w-6 h-6 text-primary-200' />,
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              className='bg-dark-200/30 rounded-2xl p-8 border border-primary-200/10 relative hover:border-primary-200/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/5'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className='absolute -top-4 -left-4 w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-dark-100 font-bold'>
                {step.step}
              </div>
              <div className='mb-4 mt-4'>{step.icon}</div>
              <h3 className='text-xl font-bold mb-3'>{step.title}</h3>
              <p className='text-light-100/70'>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className='mb-20 bg-gradient-to-br from-dark-200/30 to-dark-300/30 rounded-3xl p-12'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>Key Benefits</h2>
          <p className='text-light-100/70 max-w-2xl mx-auto'>
            Why our platform is the best choice for interview preparation.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              icon: <Clock className='w-10 h-10 text-primary-200' />,
              title: 'Practice Anytime',
              description:
                'Access our platform 24/7 to practice interviews at your own pace and convenience.',
            },
            {
              icon: <Shield className='w-10 h-10 text-primary-200' />,
              title: 'Safe Environment',
              description:
                'Practice in a judgment-free environment where you can make mistakes and learn from them.',
            },
            {
              icon: <BarChart className='w-10 h-10 text-primary-200' />,
              title: 'Track Progress',
              description:
                'Monitor your improvement over time with detailed analytics and performance metrics.',
            },
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className='flex flex-col items-center text-center p-6'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className='mb-4'>{benefit.icon}</div>
              <h3 className='text-xl font-bold mb-3'>{benefit.title}</h3>
              <p className='text-light-100/70'>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className='mb-20'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              icon: <Star className='w-8 h-8 text-primary-200' />,
              value: '100+',
              label: 'Interview Scenarios',
            },
            {
              icon: <Award className='w-8 h-8 text-primary-200' />,
              value: '50+',
              label: 'Technical Challenges',
            },
            {
              icon: <Rocket className='w-8 h-8 text-primary-200' />,
              value: '24/7',
              label: 'Available Practice',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className='bg-dark-200/30 rounded-2xl p-8 border border-primary-200/10 flex flex-col items-center text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className='mb-4'>{stat.icon}</div>
              <h3 className='text-3xl font-bold mb-2 text-primary-200'>
                {stat.value}
              </h3>
              <p className='text-light-100/70'>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Early Adopters Section */}
      <section className='mb-20'>
        <motion.div
          className='text-center mb-12'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Join Our Early Adopters
          </h2>
          <p className='text-light-100/70 max-w-2xl mx-auto'>
            Be among the first to experience our AI-powered interview practice
            platform
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {[
            {
              title: 'Free Access',
              description:
                'Get unlimited access to our AI interview practice platform during our beta phase.',
              icon: <Zap className='w-10 h-10 text-primary-200' />,
            },
            {
              title: 'Shape the Future',
              description:
                'Your feedback helps us improve and build the best interview practice platform.',
              icon: <MessageSquare className='w-10 h-10 text-primary-200' />,
            },
            {
              title: 'Early Benefits',
              description:
                'Get premium features and special offers when we launch our full version.',
              icon: <Star className='w-10 h-10 text-primary-200' />,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className='bg-dark-200/30 rounded-2xl p-8 border border-primary-200/10'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className='mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
              <p className='text-light-100/70'>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='mb-20 bg-gradient-to-br from-primary-200/20 to-dark-200/20 rounded-3xl p-12 text-center relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-200/10 to-transparent blur-3xl' />
        <div className='absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary-200/10 to-transparent blur-3xl' />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='relative z-10'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to Improve Your Interview Skills?
          </h2>
          <p className='text-light-100/70 max-w-2xl mx-auto mb-8'>
            Join our community of early adopters and start practicing with our
            AI-powered interview platform today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button asChild className='btn-primary text-lg px-8 py-6 group'>
              <Link href='/sign-in' className='flex items-center gap-2'>
                Get Started Now
                <ArrowRight className='w-5 h-5 transition-transform group-hover:translate-x-1' />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;

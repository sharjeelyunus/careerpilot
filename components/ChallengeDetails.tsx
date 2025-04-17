'use client';

import { useState } from 'react';
import {
  TechnicalChallenge,
  ChallengeSubmission,
} from '@/lib/store/technicalChallengesStore';
import { submitChallengeSolution } from '@/lib/actions/technicalChallenges.action';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Star,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Code2,
  History,
  Terminal,
  Play,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { getCurrentUser } from '@/lib/actions/auth.action';
import useSWR from 'swr';
import { Console } from '@/components/Console';
import { codeExecutionService } from '@/lib/services/codeExecution.service';

interface FeedbackData {
  score: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
}

interface ChallengeDetailsProps {
  challenge: TechnicalChallenge;
}

const LANGUAGE_MAP: { [key: string]: string } = {
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Python: 'python',
  Java: 'java',
  'C++': 'cpp',
  React: 'typescript',
  'Next.js': 'typescript',
  'Node.js': 'javascript',
  HTML: 'html',
  CSS: 'css',
  SQL: 'sql',
};

export function ChallengeDetails({ challenge }: ChallengeDetailsProps) {
  const { data: user } = useSWR('current-user', getCurrentUser);
  const [solution, setSolution] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const matchingLang = challenge.techStack.find((tech) => LANGUAGE_MAP[tech]);
    return matchingLang ? LANGUAGE_MAP[matchingLang] : 'javascript';
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<{
    output: string;
    error: string | null;
    executionTime: number;
  } | null>(null);

  // Filter submissions to only show current user's submissions
  const userSubmissions = challenge.submissions?.filter(
    (submission) => submission.userId === user?.id
  );

  const sortedSubmissions = userSubmissions?.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const bestSubmission = sortedSubmissions?.reduce<ChallengeSubmission | null>(
    (best, current) =>
      !best || current.feedback.score > best.feedback.score ? current : best,
    null
  );

  const isLanguageSupported = codeExecutionService.isSupportedLanguage(selectedLanguage);

  const handleRunCode = async () => {
    if (!solution.trim()) {
      setError('Please provide some code to run');
      return;
    }

    setIsRunning(true);
    setError(null);
    setExecutionResult(null);

    try {
      const result = await codeExecutionService.executeCode(
        solution,
        selectedLanguage
      );
      setExecutionResult(result);
    } catch (err) {
      setError('Failed to execute code. Please try again.');
      console.error('Error executing code:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!solution.trim()) {
      setError('Please provide a solution before submitting');
      return;
    }

    if (!user?.id) {
      setError('Please sign in to submit your solution');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const result = await submitChallengeSolution(
        challenge.id,
        solution,
        user.id
      );

      if (result.success && result.feedback) {
        const parsedFeedback = JSON.parse(result.feedback);
        setFeedback(parsedFeedback);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error submitting solution:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Challenge Header */}
      <div className='bg-gradient-to-r from-dark-200/50 to-dark-300/30 rounded-xl p-6 border border-primary-200/10'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <h1 className='text-2xl font-bold text-light-100'>
                {challenge.title}
              </h1>
              <div className='flex items-center gap-3 text-light-100/70'>
                <div className='flex items-center gap-1.5'>
                  <Clock className='w-4 h-4' />
                  <span className='text-sm'>{challenge.estimatedTime} min</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <Star className='w-4 h-4 text-primary-200' />
                  <span className='text-sm'>{challenge.points} points</span>
                </div>
                {bestSubmission && (
                  <div className='flex items-center gap-1.5'>
                    <Trophy className='w-4 h-4 text-amber-400' />
                    <span className='text-sm'>
                      Best: {bestSubmission.feedback.score}/100
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant='outline'
                className='bg-primary-200/10 text-primary-200 border-primary-200/20'
              >
                {challenge.difficulty}
              </Badge>
              {challenge.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant='secondary'
                  className='bg-dark-300/50'
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue='challenge' className='w-full'>
        <TabsList className='w-full grid grid-cols-2 bg-dark-200/50 p-1 rounded-xl mb-6'>
          <TabsTrigger
            value='challenge'
            className='data-[state=active]:bg-primary-200/10 rounded-lg transition-all data-[state=active]:text-primary-200'
          >
            <Terminal className='w-4 h-4 mr-2' />
            Challenge
          </TabsTrigger>
          <TabsTrigger
            value='submissions'
            className='data-[state=active]:bg-primary-200/10 rounded-lg transition-all data-[state=active]:text-primary-200'
          >
            <History className='w-4 h-4 mr-2' />
            Your Submissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value='challenge' className='mt-4 space-y-6'>
          {/* Challenge Description */}
          <Card className='bg-dark-200/30 border-primary-200/10'>
            <CardContent className='pt-6'>
              <div className='prose prose-invert max-w-none'>
                <div className='bg-dark-300/30 rounded-lg p-6 border border-primary-200/10'>
                  <div className='prose prose-invert prose-p:text-light-100/90 prose-headings:text-light-100 prose-a:text-primary-200 prose-strong:text-light-100 prose-code:text-primary-200 prose-pre:bg-dark-300/50 prose-pre:border prose-pre:border-primary-200/10 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-auto prose-code:bg-dark-300/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-ul:list-disc prose-ul:list-inside prose-ol:list-decimal prose-ol:list-inside prose-li:text-light-100/90 prose-blockquote:border-l-4 prose-blockquote:border-primary-200/20 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-light-100/70'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {challenge.description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card className='bg-dark-200/30 border-primary-200/10'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg font-semibold text-light-100'>
                  Your Solution
                </CardTitle>
                <div className='flex items-center gap-2'>
                  <Code2 className='w-4 h-4 text-primary-200' />
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className='w-[180px] bg-dark-300/50 border-primary-200/20'>
                      <SelectValue placeholder='Select Language' />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        new Map(
                          Object.entries(LANGUAGE_MAP).filter(([lang]) =>
                            challenge.techStack.some((tech) =>
                              tech.toLowerCase().includes(lang.toLowerCase())
                            )
                          )
                        ).entries()
                      ).map(([lang, value]) => (
                        <SelectItem key={lang} value={value}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='min-h-[400px] border border-primary-200/20 rounded-lg overflow-hidden'>
                <Editor
                  height='400px'
                  defaultLanguage={selectedLanguage}
                  language={selectedLanguage}
                  value={solution}
                  onChange={(value) => setSolution(value || '')}
                  theme='vs-dark'
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                  className='border-none'
                />
              </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-4'>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='w-full flex items-start gap-2 bg-red-500/10 text-red-200 p-4 rounded-lg border border-red-500/20'
                >
                  <AlertCircle className='w-5 h-5 mt-0.5' />
                  <p>{error}</p>
                </motion.div>
              )}
              <div className='flex gap-2'>
                {isLanguageSupported && (
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    variant='outline'
                    className='flex-1 bg-dark-300/50 hover:bg-dark-300/70 text-light-100 border-primary-200/20'
                  >
                    {isRunning ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-2 border-light-100 border-t-transparent mr-2' />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className='w-4 h-4 mr-2' />
                        Run Code
                      </>
                    )}
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 bg-primary-200 hover:bg-primary-200/90 text-dark-100 font-medium ${!isLanguageSupported ? 'w-full' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-2 border-dark-100 border-t-transparent mr-2' />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='w-4 h-4 mr-2' />
                      Submit Solution
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Console Output */}
          {isLanguageSupported && (
            <div className='lg:h-full'>
              <Console
                output={executionResult?.output ?? ''}
                error={executionResult?.error ?? null}
                executionTime={executionResult?.executionTime ?? 0}
                className='h-full'
              />
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='bg-dark-200/30 rounded-xl border border-primary-200/10 p-6 space-y-6'
            >
              <div className='flex items-center justify-between border-b border-primary-200/10 pb-4'>
                <h3 className='text-xl font-semibold text-light-100'>
                  Feedback
                </h3>
                <div className='flex items-center gap-2 text-primary-200'>
                  <Trophy className='w-5 h-5' />
                  <span className='text-lg font-medium'>
                    Score: {feedback.score}/100
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {feedback.strengths.length > 0 && (
                  <div className='space-y-3'>
                    <h4 className='font-medium text-green-200 flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4' />
                      Strengths
                    </h4>
                    <ul className='space-y-2 text-light-100/80'>
                      {feedback.strengths.map((strength, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='text-green-200/20'>•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.improvements.length > 0 && (
                  <div className='space-y-3'>
                    <h4 className='font-medium text-amber-200 flex items-center gap-2'>
                      <AlertCircle className='w-4 h-4' />
                      Areas for Improvement
                    </h4>
                    <ul className='space-y-2 text-light-100/80'>
                      {feedback.improvements.map((improvement, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='text-amber-200/20'>•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback.suggestions.length > 0 && (
                  <div className='space-y-3'>
                    <h4 className='font-medium text-blue-200 flex items-center gap-2'>
                      <Code2 className='w-4 h-4' />
                      Suggestions
                    </h4>
                    <ul className='space-y-2 text-light-100/80'>
                      {feedback.suggestions.map((suggestion, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='text-blue-200/20'>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value='submissions' className='mt-4'>
          {sortedSubmissions && sortedSubmissions.length > 0 ? (
            <div className='space-y-4'>
              <Accordion type='single' collapsible className='space-y-4'>
                {sortedSubmissions.map((submission, index) => (
                  <AccordionItem
                    key={submission.id}
                    value={`submission-${index}`}
                    className='border-none [&[data-state=open]]:bg-dark-300/30'
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className='bg-dark-200/30 rounded-xl border border-primary-200/10 overflow-hidden transition-colors'
                    >
                      <AccordionTrigger className='px-6 py-4 hover:no-underline group w-full'>
                        <div className='flex items-center justify-between w-full'>
                          <div className='flex items-center gap-6'>
                            <span className='text-light-100/70 text-sm font-medium'>
                              Attempt {sortedSubmissions.length - index}
                            </span>
                            <div className='flex items-center gap-2 text-primary-200'>
                              <Trophy className='w-4 h-4' />
                              <span className='font-medium'>
                                Score: {submission.feedback.score}/100
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-4'>
                            <span className='text-light-100/50 text-sm'>
                              {format(
                                new Date(submission.submittedAt),
                                'MMM d, yyyy HH:mm'
                              )}
                            </span>
                            <div className='h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 text-primary-200/50'>
                              ↓
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className='border-t border-primary-200/10'>
                        <div className='p-6 space-y-6'>
                          <div className='bg-dark-300/50 rounded-lg overflow-hidden border border-primary-200/20'>
                            <Editor
                              height='200px'
                              defaultLanguage={selectedLanguage}
                              value={submission.solution}
                              theme='vs-dark'
                              options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                              }}
                            />
                          </div>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {submission.feedback.strengths.length > 0 && (
                              <div className='space-y-3 bg-dark-300/30 p-4 rounded-lg'>
                                <h4 className='font-medium text-green-200 flex items-center gap-2'>
                                  <CheckCircle2 className='w-4 h-4' />
                                  Strengths
                                </h4>
                                <ul className='space-y-2 text-light-100/80'>
                                  {submission.feedback.strengths.map(
                                    (strength, i) => (
                                      <li
                                        key={i}
                                        className='flex items-start gap-2'
                                      >
                                        <span className='text-green-200/20'>
                                          •
                                        </span>
                                        <span>{strength}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            {submission.feedback.improvements.length > 0 && (
                              <div className='space-y-3 bg-dark-300/30 p-4 rounded-lg'>
                                <h4 className='font-medium text-amber-200 flex items-center gap-2'>
                                  <AlertCircle className='w-4 h-4' />
                                  Areas for Improvement
                                </h4>
                                <ul className='space-y-2 text-light-100/80'>
                                  {submission.feedback.improvements.map(
                                    (improvement, i) => (
                                      <li
                                        key={i}
                                        className='flex items-start gap-2'
                                      >
                                        <span className='text-amber-200/20'>
                                          •
                                        </span>
                                        <span>{improvement}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            {submission.feedback.suggestions.length > 0 && (
                              <div className='space-y-3 bg-dark-300/30 p-4 rounded-lg'>
                                <h4 className='font-medium text-blue-200 flex items-center gap-2'>
                                  <Code2 className='w-4 h-4' />
                                  Suggestions
                                </h4>
                                <ul className='space-y-2 text-light-100/80'>
                                  {submission.feedback.suggestions.map(
                                    (suggestion, i) => (
                                      <li
                                        key={i}
                                        className='flex items-start gap-2'
                                      >
                                        <span className='text-blue-200/20'>
                                          •
                                        </span>
                                        <span>{suggestion}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </motion.div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center bg-dark-200/30 rounded-xl border border-primary-200/10 p-8 text-center'>
              <History className='w-12 h-12 text-primary-200/20 mb-4' />
              <h3 className='text-lg font-medium text-light-100 mb-2'>
                No submissions yet
              </h3>
              <p className='text-light-100/70'>
                Submit your first solution to see your attempts here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

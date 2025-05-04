'use client';

import { interviewer } from '@/constants';
import { getCurrentUser } from '@/lib/actions/auth.action';
import Controls from '@/components/Controls';
import { createFeedback } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { echoPilot } from '@/lib/echoPilot.sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SpinnerLoader from './ui/loader';
import useSWR from 'swr';
import { AgentProps } from '@/types';
import { AppEvents } from '@/lib/services/app-events.service';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const { data: user } = useSWR('current-user', getCurrentUser);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [callStartTime, setCallStartTime] = useState(0);

  useEffect(() => {
    // Check if EchoPilot token is available
    if (!process.env.NEXT_PUBLIC_ECHOPILOT_API_KEY) {
      console.error('EchoPilot token is not available');
      return;
    }

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.INACTIVE);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error('Error', error);
      router.push('/');
    };

    echoPilot.on('call-start', onCallStart);
    echoPilot.on('call-end', onCallEnd);
    echoPilot.on('message', onMessage);
    echoPilot.on('speech-start', onSpeechStart);
    echoPilot.on('speech-end', onSpeechEnd);
    echoPilot.on('error', onError);

    return () => {
      echoPilot.off('call-start', onCallStart);
      echoPilot.off('call-end', onCallEnd);
      echoPilot.off('message', onMessage);
      echoPilot.off('speech-start', onSpeechStart);
      echoPilot.off('speech-end', onSpeechEnd);
      echoPilot.off('error', onError);
    };
  }, [router]);

  useEffect(() => {
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      setIsLoading(true);
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.error('Error saving feedback');
        router.push('/');
      }
      setIsLoading(false);
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === 'generate') {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, router, interviewId]);

  useEffect(() => {
    // Track interview start
    if (callStatus === CallStatus.ACTIVE && interviewId) {
      AppEvents.trackUserEngagement('interview_start', 0, {
        interview_id: interviewId,
        type: type || 'unknown',
        question_count: questions?.length || 0,
      });
    }

    // Track interview end
    if (callStatus === CallStatus.FINISHED && interviewId) {
      const duration = Math.floor((Date.now() - callStartTime) / 1000);
      AppEvents.trackUserEngagement('interview_end', duration, {
        interview_id: interviewId,
        type: type || 'unknown',
        question_count: questions?.length || 0,
      });
    }
  }, [callStatus, interviewId, type, questions, callStartTime]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const cleanQuestion = (question: string) => {
      return question.replace(/\*\*/g, '');
    };
    try {
      if (type === 'generate' && interviewId) {
        await AppEvents.trackFeatureUsage('interview', 'start_generation', {
          interview_id: interviewId,
        });
        await echoPilot.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: user?.name || '',
            userid: user?.id || '',
          },
        });
      } else if (interviewId) {
        let formattedQuestions = '';
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${cleanQuestion(question)}`)
            .join('\n');
        }

        await AppEvents.trackFeatureUsage('interview', 'start_interview', {
          interview_id: interviewId,
          question_count: questions?.length || 0,
        });

        await echoPilot.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
      setCallStartTime(Date.now());
    } catch (error) {
      console.error('Error starting call:', error);
      await AppEvents.trackError(error as Error, {
        context: 'interview_call_start',
        interview_id: interviewId || 'unknown',
        type: type || 'unknown',
      });
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnectCall = async () => {
    setCallStatus(CallStatus.FINISHED);
    const duration = Math.floor((Date.now() - callStartTime) / 1000);
    if (interviewId) {
      await AppEvents.trackFeatureUsage('interview', 'end_interview', {
        interview_id: interviewId,
        duration,
        type: type || 'unknown',
      });
    }
    echoPilot.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <>
      <div className='call-view'>
        <div className='card-interviewer'>
          <div className='avatar'>
            <Image
              src='/ai-avatar.png'
              alt='EchoPilot'
              width={65}
              height={54}
              className='object-cover'
            ></Image>
            {isSpeaking && <span className='animate-speak' />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className='card-border'>
          <div className='card-content'>
            <Image
              src={user?.photoURL || '/robot.png'}
              alt='user avatar'
              width={540}
              height={540}
              className='rounded-full object-cover size-[120px]'
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
      {messages.length > 0 && (
        <div className='transcript-border'>
          <div className='transcript'>
            <p
              key={latestMessage}
              className={cn(
                'transition-opacity duration-500 opacity-0',
                'animate-fadeIn opacity-100'
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}
      <div className='w-full flex justify-center'>
        <Controls
          agent={echoPilot}
          isLoading={callStatus === CallStatus.CONNECTING}
          isConnected={callStatus === CallStatus.ACTIVE}
          onStartCall={handleCall}
          onStopCall={handleDisconnectCall}
          disabled={false}
        />
      </div>
    </>
  );
};

export default Agent;

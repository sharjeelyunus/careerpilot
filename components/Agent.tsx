'use client';

import { interviewer } from '@/constants';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { createFeedback } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SpinnerLoader from './ui/loader';
import useSWR from 'swr';
import { AgentProps } from '@/types';

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

  useEffect(() => {
    // Check if Vapi token is available
    if (!process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN) {
      console.error('Vapi token is not available');
      return;
    }

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.INACTIVE);

    const onMessage = (message: Message) => {
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

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
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

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    const cleanQuestion = (question: string) => {
      return question.replace(/\*\*/g, '');
    };
    try {
      if (type === 'generate') {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: user?.name || '',
            userid: user?.id || '',
          },
        });
      } else {
        let formattedQuestions = '';
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${cleanQuestion(question)}`)
            .join('\n');
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnectCall = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

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
              alt='vapi'
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
        {callStatus !== CallStatus.ACTIVE ? (
          <button className='relative btn-call' onClick={handleCall}>
            <span
              className={cn(
                'absolute animate-ping rounded-full opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span>{isCallInactiveOrFinished ? 'Call' : '...'}</span>
          </button>
        ) : (
          <button className='btn-disconnect' onClick={handleDisconnectCall}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;

/**
 * @file Agent.tsx
 * @description Component for managing and displaying an AI-powered agent interaction, typically for an interview.
 * It handles call lifecycle (connecting, active, finished), speech events, message display, and feedback generation via EchoPilot SDK.
 *
 * @module components/features/interviews/Agent
 *
 * @param {string} [userName] - The name of the user interacting with the agent. (Currently unused, consider for future use or removal)
 * @param {string} userId - The ID of the user.
 * @param {'generate' | string} type - The type of interaction (e.g., 'generate' for a generation task, or other interview types).
 * @param {string} interviewId - The ID of the current interview session.
 * @param {string[]} [questions] - An array of questions to be used in the interview.
 *
 * @returns {JSX.Element} The Agent interaction UI, including avatar, speaking indicator, and call controls.
 *
 * @version 1.0.2
 * @date 2023-10-29 (Placeholder, actual date may vary)
 *
 * @dependencies
 * - next/image, next/navigation for Next.js functionalities.
 * - react for core React hooks.
 * - swr for data fetching (current user).
 * - lucide-react for icons.
 * - sonner for toast notifications.
 * - @/constants for interviewer details.
 * - @/lib/actions/auth.action for getting current user.
 * - @/lib/actions/general.action for creating feedback.
 * - @/components/Controls (path may need update) for call control UI.
 * - @/components/ui/loader for loading spinner.
 * - @/lib/utils for utility functions.
 * - @/lib/echoPilot.sdk for agent interaction.
 * - @/types for AgentProps and User type.
 * - @/lib/services/app-events.service for tracking events.
 *
 * @note Manages complex state related to call status and message history.
 * Interacts heavily with the EchoPilot SDK.
 * The `userName` prop is passed but not currently used within the component's logic.
 * The `Controls` component path will be updated once it's moved.
 */

'use client';

// React/Next.js
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// External Libraries
import useSWR from 'swr';
import { User as UserIcon } from 'lucide-react'; // Renamed to avoid conflict with User type
import { toast } from 'sonner';

// UI Components
import SpinnerLoader from '@/components/ui/loader';
import Controls from '@/components/Controls'; // TODO: Update path when Controls.tsx is moved (e.g., to @/components/features/interviews/Controls)

// Custom Hooks & Services
import { AppEvents } from '@/lib/services/app-events.service';
import { echoPilot } from '@/lib/echoPilot.sdk';
import type { AssistantDTO } from '@echopilot/web-sdk'; // Corrected import for AssistantDTO

// Utilities & Constants
import { interviewer } from '@/constants'; // This is an AssistantDTO
import { cn } from '@/lib/utils';

// Actions
import { getCurrentUser } from '@/lib/actions/auth.action';
import { createFeedback } from '@/lib/actions/general.action';

// Type Definitions
import type { AgentProps, User } from '@/types'; // Imported User type

/**
 * @interface EchoPilotTranscriptMessage
 * @description Defines the expected structure for transcript messages from the EchoPilot SDK.
 * This is a partial definition. Replace with actual SDK type if available.
 */
interface EchoPilotTranscriptMessage {
  type: 'transcript';
  transcriptType?: 'partial' | 'final';
  role: 'user' | 'system' | 'assistant';
  transcript: string;
  // Other fields might exist in the SDK's message type.
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

const Agent = ({
  // userName, // Prop is available but not used directly.
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const { data: user } = useSWR<User | null>('current-user', getCurrentUser); // Typed SWR data

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [callStartTime, setCallStartTime] = useState(0);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ECHOPILOT_API_KEY) {
      console.error('EchoPilot token is not available. Call functionality will be disabled.');
      return;
    }

    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      setCallStatus(CallStatus.INACTIVE);
      setIsSpeaking(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onMessage = (message: any) => {
      const sdkMessage = message as EchoPilotTranscriptMessage;
      if (sdkMessage.type === 'transcript' && sdkMessage.transcriptType === 'final') {
        const newMessage: SavedMessage = {
          role: sdkMessage.role,
          content: sdkMessage.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error('EchoPilot SDK Error:', error);
      toast.error('Call connection error. Please try again.');
      setCallStatus(CallStatus.INACTIVE);
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
      if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
        if (echoPilot && typeof echoPilot.stop === 'function') {
          echoPilot.stop();
        }
      }
    };
  }, [callStatus]);

  useEffect(() => {
    const handleGenerateFeedback = async (currentMessages: SavedMessage[]) => {
      if (!interviewId || !userId) {
        console.error('Missing interviewId or userId for feedback generation.');
        toast.error('Cannot generate feedback: Missing required information.');
        return;
      }
      setIsProcessing(true);
      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId,
          userId,
          transcript: currentMessages,
        });

        if (success && id) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.error('Error saving feedback or feedbackId not returned.');
          toast.error('Could not save your feedback. Please try again later.');
        }
      } catch (feedbackError) {
        console.error('Failed to generate feedback:', feedbackError);
        toast.error('An error occurred while generating your feedback.');
      } finally {
        setIsProcessing(false);
      }
    };

    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      if (type === 'generate') {
        router.push('/');
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId, router, interviewId]);

  useEffect(() => {
    if (!interviewId) return;

    if (callStatus === CallStatus.ACTIVE) {
      AppEvents.trackUserEngagement('interview_start', 0, {
        interview_id: interviewId,
        type: type || 'unknown',
        question_count: questions?.length || 0,
      });
    }

    if (callStatus === CallStatus.FINISHED) {
      const duration = callStartTime > 0 ? Math.floor((Date.now() - callStartTime) / 1000) : 0;
      AppEvents.trackUserEngagement('interview_end', duration, {
        interview_id: interviewId,
        type: type || 'unknown',
        question_count: questions?.length || 0,
      });
    }
  }, [callStatus, interviewId, type, questions, callStartTime]);

  const handleCall = async () => {
    if (!process.env.NEXT_PUBLIC_ECHOPILOT_API_KEY) {
      toast.error('Call service is currently unavailable.');
      return;
    }
    setCallStatus(CallStatus.CONNECTING);
    const cleanQuestion = (question: string) => question.replace(/\*\*/g, '');

    try {
      const variableValues: Record<string, string> = {
        username: user?.name || 'User',
        userid: user?.id || 'unknown-user',
      };
      let assistantConfig: AssistantDTO | string | undefined = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;

      if (type === 'generate' && interviewId) {
        await AppEvents.trackFeatureUsage('interview', 'start_generation', {
          interview_id: interviewId,
        });
      } else if (interviewId) {
        assistantConfig = interviewer;
        if (questions && questions.length > 0) {
          variableValues.questions = questions
            .map((q) => `- ${cleanQuestion(q)}`)
            .join('\n');
        }
        await AppEvents.trackFeatureUsage('interview', 'start_interview', {
          interview_id: interviewId,
          question_count: questions?.length || 0,
        });
      } else {
        console.error('Cannot start call: interviewId missing and type is not \'generate\'.');
        toast.error('Cannot start interview: Required information missing.');
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      if (!assistantConfig) {
        console.error('Assistant configuration (workflow ID or DTO) is not defined.');
        toast.error('Call configuration error.');
        setCallStatus(CallStatus.INACTIVE);
        return;
      }
      
      setMessages([]);
      await echoPilot.start(assistantConfig, { variableValues });
      setCallStartTime(Date.now());
    } catch (error) {
      console.error('Error starting call:', error);
      await AppEvents.trackError(error as Error, {
        context: 'interview_call_start',
        interview_id: interviewId || 'unknown',
        type: type || 'unknown',
      });
      toast.error('Failed to start the call. Please try again.');
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnectCall = async () => {
    setCallStatus(CallStatus.FINISHED);
    if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
        if (echoPilot && typeof echoPilot.stop === 'function') {
          echoPilot.stop();
        }
    }
    if (interviewId) {
      await AppEvents.trackFeatureUsage('interview', 'explicit_disconnect', {
        interview_id: interviewId,
        type: type || 'unknown',
      });
    }
  };

  if (isProcessing && callStatus === CallStatus.FINISHED) {
    return (
      <div className="min-h-screen flex-center flex-col">
        <SpinnerLoader />
        <p className="mt-4 text-light-100/70">Generating your feedback...</p>
      </div>
    );
  }

  return (
    <div className={cn('call-view flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]', { 'call-active': callStatus === CallStatus.ACTIVE })}>
      <div className="card-interviewer text-center mb-8">
        <div
          className={cn(
            'avatar w-32 h-32 rounded-full bg-dark-200 flex-center mx-auto mb-4 border-4 border-transparent',
            {
              'animate-pulse border-primary-200/50': callStatus === CallStatus.CONNECTING,
              'border-primary-200': callStatus === CallStatus.ACTIVE && isSpeaking,
              'border-dark-100': callStatus === CallStatus.ACTIVE && !isSpeaking,
            }
          )}
        >
          {user?.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.name || 'User'}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-16 h-16 text-primary-200" />
          )}
        </div>
        <h3 className="text-xl font-semibold mt-4 text-light-100">
          {callStatus === CallStatus.ACTIVE
            ? isSpeaking ? 'Agent is Speaking...' : 'Listening...'
            : callStatus === CallStatus.CONNECTING
            ? 'Connecting to Interview Agent...'
            : callStatus === CallStatus.FINISHED
            ? 'Interview Session Ended'
            : 'Ready to Start Your Interview'}
        </h3>
        {callStatus === CallStatus.ACTIVE && !isSpeaking && (
            <p className="text-sm text-primary-200/70">It's your turn to speak.</p>
        )}
      </div>

      <Controls
        agent={echoPilot}
        isConnected={callStatus === CallStatus.ACTIVE}
        isLoading={callStatus === CallStatus.CONNECTING}
        onStartCall={handleCall}
        onStopCall={handleDisconnectCall}
        disabled={isProcessing || (callStatus !== CallStatus.INACTIVE && callStatus !== CallStatus.ACTIVE && callStatus !== CallStatus.CONNECTING )}
      />
    </div>
  );
};

export default Agent; 
import { db } from '@/firebase/client';
import { Timestamp, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export type FeedbackType = 'bug' | 'feature' | 'general';

export interface Feedback {
  id?: string;
  userId: string;
  type: FeedbackType;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userEmail?: string;
  userDisplayName?: string;
}

export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
  try {
    const feedbackData: Omit<Feedback, 'id'> = {
      ...feedback,
      status: 'open',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const feedbackRef = collection(db, 'users-feedback');
    const docRef = await addDoc(feedbackRef, feedbackData);
    return { id: docRef.id, ...feedbackData };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export const getFeedbackByUser = async (userId: string) => {
  try {
    const feedbackRef = collection(db, 'users-feedback');
    const q = query(
      feedbackRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as Feedback[];
  } catch (error) {
    console.error('Error getting user feedback:', error);
    throw error;
  }
}; 
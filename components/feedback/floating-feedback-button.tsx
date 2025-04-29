import { FeedbackDialog } from './feedback-dialog';

export function FloatingFeedbackButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <FeedbackDialog />
    </div>
  );
} 
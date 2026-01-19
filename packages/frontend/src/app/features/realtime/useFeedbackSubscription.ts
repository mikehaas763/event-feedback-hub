import { useSubscription } from 'urql';
import { Feedback } from '../feedback-list/useFeedbacks';

const FEEDBACK_ADDED_SUBSCRIPTION = `
  subscription FeedbackAdded($eventId: ID!) {
    feedbackAdded(eventId: $eventId) {
      id
      eventId
      text
      rating
      createdAt
    }
  }
`;

interface FeedbackAddedResult {
  feedbackAdded: Feedback;
}

export function useFeedbackSubscription(
  eventId: string,
  onFeedbackAdded: (feedback: Feedback) => void
) {
  useSubscription<FeedbackAddedResult>(
    {
      query: FEEDBACK_ADDED_SUBSCRIPTION,
      variables: { eventId },
      pause: !eventId,
    },
    (_, response) => {
      if (response?.feedbackAdded) {
        onFeedbackAdded(response.feedbackAdded);
      }
      return response;
    }
  );
}

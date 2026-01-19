import { useMutation } from 'urql';

const SUBMIT_FEEDBACK_MUTATION = `
  mutation SubmitFeedback($eventId: ID!, $text: String!, $rating: Int!) {
    submitFeedback(eventId: $eventId, text: $text, rating: $rating) {
      id
      eventId
      text
      rating
      createdAt
    }
  }
`;

export interface Feedback {
  id: string;
  eventId: string;
  text: string;
  rating: number;
  createdAt: string;
}

interface SubmitFeedbackResult {
  submitFeedback: Feedback;
}

export function useSubmitFeedback() {
  const [result, executeMutation] = useMutation<SubmitFeedbackResult>(SUBMIT_FEEDBACK_MUTATION);

  const submitFeedback = (eventId: string, text: string, rating: number) => {
    return executeMutation({ eventId, text, rating });
  };

  return {
    submitFeedback,
    submitting: result.fetching,
    error: result.error,
  };
}

import { useQuery } from 'urql';

const FEEDBACKS_QUERY = `
  query Feedbacks($eventId: ID!) {
    feedbacks(eventId: $eventId) {
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

interface FeedbacksResult {
  feedbacks: Feedback[];
}

export function useFeedbacks(eventId: string) {
  const [result, reexecute] = useQuery<FeedbacksResult>({
    query: FEEDBACKS_QUERY,
    variables: { eventId },
    pause: !eventId,
    requestPolicy: 'cache-and-network',
  });

  return {
    feedbacks: result.data?.feedbacks ?? [],
    fetching: result.fetching,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: 'network-only' }),
  };
}

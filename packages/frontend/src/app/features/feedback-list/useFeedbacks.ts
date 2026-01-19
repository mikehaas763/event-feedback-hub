import { useQuery } from 'urql';

const FEEDBACKS_QUERY = `
  query Feedbacks($eventId: ID!, $minRating: Int, $first: Int, $after: String) {
    feedbacks(eventId: $eventId, minRating: $minRating, first: $first, after: $after) {
      edges {
        node {
          id
          eventId
          text
          rating
          createdAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
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

export interface FeedbackFilters {
  minRating?: number;
  first?: number;
  after?: string;
}

interface FeedbackEdge {
  node: Feedback;
  cursor: string;
}

interface FeedbacksQueryResult {
  feedbacks: {
    edges: FeedbackEdge[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    totalCount: number;
  };
}

export function useFeedbacks(eventId: string, filters: FeedbackFilters = {}) {
  const [result, reexecute] = useQuery<FeedbacksQueryResult>({
    query: FEEDBACKS_QUERY,
    variables: { eventId, ...filters },
    pause: !eventId,
    requestPolicy: 'cache-and-network',
  });

  return {
    feedbacks: result.data?.feedbacks.edges.map((e) => e.node) ?? [],
    totalCount: result.data?.feedbacks.totalCount ?? 0,
    hasNextPage: result.data?.feedbacks.pageInfo.hasNextPage ?? false,
    endCursor: result.data?.feedbacks.pageInfo.endCursor ?? null,
    fetching: result.fetching,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: 'network-only' }),
  };
}

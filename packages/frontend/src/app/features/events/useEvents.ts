import { useQuery } from 'urql';

export interface Event {
  id: string;
  name: string;
  type: string;
  date: string;
}

const EVENTS_QUERY = `
  query Events {
    events {
      id
      name
      type
      date
    }
  }
`;

interface EventsResult {
  events: Event[];
}

export function useEvents() {
  const [result] = useQuery<EventsResult>({ query: EVENTS_QUERY });

  return {
    events: result.data?.events ?? [],
    fetching: result.fetching,
    error: result.error,
  };
}

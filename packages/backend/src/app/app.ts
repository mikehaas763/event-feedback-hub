import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import mercurius from 'mercurius';

/* eslint-disable-next-line */
export interface AppOptions {}

// In-memory store
interface Feedback {
  id: string;
  eventId: string;
  text: string;
  rating: number;
  createdAt: string;
}

const store: {
  events: { id: string; name: string; type: string; date: string }[];
  feedbacks: Feedback[];
} = {
  events: [
    { id: '1', name: 'React Summit 2026', type: 'Conference', date: '2026-03-15' },
    { id: '2', name: 'TypeScript Workshop', type: 'Workshop', date: '2026-02-20' },
    { id: '3', name: 'GraphQL Best Practices', type: 'Webinar', date: '2026-01-25' },
    { id: '4', name: 'Node.js Performance Tuning', type: 'Workshop', date: '2026-04-10' },
  ],
  feedbacks: [],
};

const schema = `
  type Event {
    id: ID!
    name: String!
    type: String!
    date: String!
  }

  type Feedback {
    id: ID!
    eventId: ID!
    text: String!
    rating: Int!
    createdAt: String!
  }

  type FeedbackEdge {
    node: Feedback!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type FeedbackConnection {
    edges: [FeedbackEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Query {
    hello: String
    events: [Event!]!
    feedbacks(eventId: ID!, minRating: Int, first: Int, after: String): FeedbackConnection!
  }

  type Mutation {
    submitFeedback(eventId: ID!, text: String!, rating: Int!): Feedback!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
    events: () => store.events,
    feedbacks: (_: unknown, { eventId, minRating, first = 10, after }: { 
      eventId: string; 
      minRating?: number; 
      first?: number; 
      after?: string;
    }) => {
      let filtered = store.feedbacks.filter((f) => f.eventId === eventId);
      
      if (minRating !== undefined) {
        filtered = filtered.filter((f) => f.rating >= minRating);
      }
      
      const totalCount = filtered.length;
      
      // Find starting point if cursor provided
      if (after) {
        const cursorIndex = filtered.findIndex((f) => f.id === after);
        if (cursorIndex !== -1) {
          filtered = filtered.slice(cursorIndex + 1);
        }
      }
      
      const hasNextPage = filtered.length > first;
      const edges = filtered.slice(0, first).map((feedback) => ({
        node: feedback,
        cursor: feedback.id,
      }));
      
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
        totalCount,
      };
    },
  },
  Mutation: {
    submitFeedback: (_: unknown, { eventId, text, rating }: { eventId: string; text: string; rating: number }) => {
      const feedback: Feedback = {
        id: String(store.feedbacks.length + 1),
        eventId,
        text,
        rating,
        createdAt: new Date().toISOString(),
      };
      store.feedbacks.push(feedback);
      return feedback;
    },
  },
};

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Enable CORS for frontend
  fastify.register(cors, {
    origin: ['http://localhost:4200'],
  });

  // Register GraphQL
  fastify.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
  });

  // This loads all plugins defined in plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}

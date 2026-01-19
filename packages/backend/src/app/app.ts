import * as path from 'path';
import { FastifyInstance } from 'fastify';
import AutoLoad from '@fastify/autoload';
import cors from '@fastify/cors';
import mercurius from 'mercurius';

/* eslint-disable-next-line */
export interface AppOptions {}

const schema = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
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

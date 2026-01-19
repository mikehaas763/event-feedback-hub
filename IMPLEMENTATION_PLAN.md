# Event Feedback Hub - Implementation Plan

## Overview

A TypeScript web application where users can share feedback on events (workshops, webinars, conferences) and view others' feedback in real-time.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) + Ant Design v6 |
| Backend | Fastify + Mercurius (GraphQL) |
| Database | In-memory store |
| Real-time | GraphQL Subscriptions (WebSockets) |

## Architecture

- **Vertical Slicing**: Each commit delivers a complete feature (frontend + backend)
- **Feature-First Organization**: Code grouped by feature, not file type
- **Incremental Schema**: GraphQL types added only when needed

---

## Commit Plan

### Commit 1: Project Setup & Ant Design
*Minimal foundation with visible App shell*

**Status**: ✅ Complete

**Backend:**
- [x] Added CORS support for frontend origin

**Frontend:**
- [x] Install `antd@latest` (v6), `@ant-design/icons`
- [x] Install `urql`, `graphql`, `graphql-ws`
- [x] Configure Ant Design Provider (with dark theme for Header)
- [x] Configure GraphQL client (pointing to backend)

**Visible UI:**
- [x] App shell with Ant Design Layout (Header, Content)
- [x] Header: "Event Feedback Hub" title
- [x] Content area: Welcome Card with description
- [x] Display GraphQL response from `hello` query

---

### Commit 2: Events List & Selection
*Users can see and select events*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Add `Event` type to schema (id, name, type, date)
- [ ] Add `Query.events`
- [ ] Create in-memory store with events array
- [ ] Seed sample events (3-5 events)

**Frontend:**
- [ ] Create `features/events/` module
  - [ ] EventSelector component
  - [ ] useEvents hook
  - [ ] types

**Visible UI:**
- [ ] Event dropdown selector in the content area
- [ ] When event selected: Show Card with event details (name, type, date)
- [ ] Placeholder text: "Select an event to see feedback and submit your own"

---

### Commit 3: Feedback Submission
*Users can submit feedback (form visible, success message shown)*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Add `Feedback` type to schema (id, eventId, text, rating, createdAt)
- [ ] Add `Mutation.submitFeedback(eventId, text, rating)`
- [ ] Add feedbacks array to store

**Frontend:**
- [ ] Create `features/feedback-form/` module
  - [ ] FeedbackForm component
  - [ ] useSubmitFeedback hook

**Visible UI:**
- [ ] Feedback form below event selector (disabled until event selected)
- [ ] Form: TextArea + Star Rating + Submit Button
- [ ] On submit: Success notification + form resets
- [ ] Temporary: Show "Feedback submitted! (Display coming in next update)" message

---

### Commit 4: Feedback Display
*Users can view feedback for selected event*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Add `Query.feedbacks(eventId)` (basic, no filters yet)

**Frontend:**
- [ ] Create `features/feedback-stream/` module
  - [ ] FeedbackList component
  - [ ] FeedbackCard component
  - [ ] useFeedbacks hook

**Visible UI:**
- [ ] Feedback list below the form
- [ ] Each feedback shows: rating stars, feedback text, timestamp
- [ ] Empty state: "No feedback yet. Be the first!"
- [ ] Loading state: Skeleton cards while fetching
- [ ] Newly submitted feedback appears in list (refetch after submit)

---

### Commit 5: Filtering & Pagination
*Users can filter and paginate feedback*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Extend `Query.feedbacks` with filter/pagination args (minRating, limit, offset)
- [ ] Return total count

**Frontend:**
- [ ] Create `features/feedback-filters/` module
  - [ ] FeedbackFilters component
  - [ ] Pagination component

**Visible UI:**
- [ ] Filter bar above feedback list: "Filter by rating" dropdown
- [ ] Pagination below list
- [ ] "Showing X of Y feedback" count
- [ ] Filters apply immediately, list updates

---

### Commit 6: Real-Time Updates
*Live updates when others submit feedback*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Add `Subscription.feedbackAdded(eventId)`
- [ ] Add pubsub mechanism
- [ ] Publish on mutation

**Frontend:**
- [ ] Create `features/realtime/` module
  - [ ] useFeedbackSubscription hook

**Visible UI:**
- [ ] Connection status badge in header (green dot = live)
- [ ] New feedback slides in at top of list with highlight animation
- [ ] Toast notification: "New feedback received!"
- [ ] Test by opening two browser tabs

---

### Commit 7: Polish & E2E Tests
*Final UX improvements*

**Status**: ⬜ Not Started

**Backend:**
- [ ] Input validation improvements
- [ ] Better error messages

**Frontend:**
- [ ] Loading spinners/skeletons everywhere
- [ ] Error states with Ant Design Result component
- [ ] Empty states with illustrations
- [ ] Responsive layout (mobile-friendly)
- [ ] Theme polish (colors, spacing)

**E2E Tests:**
- [ ] Test event selection flow
- [ ] Test feedback submission
- [ ] Test filtering functionality
- [ ] Test real-time updates

---

## File Structure (Target)

```
packages/
├── backend/
│   └── src/
│       ├── main.ts
│       ├── app/
│       │   ├── app.ts
│       │   └── plugins/
│       ├── features/
│       │   ├── events/
│       │   │   ├── events.schema.ts
│       │   │   ├── events.resolvers.ts
│       │   │   └── events.types.ts
│       │   ├── feedback/
│       │   │   ├── feedback.schema.ts
│       │   │   ├── feedback.resolvers.ts
│       │   │   ├── feedback.types.ts
│       │   │   └── feedback.pubsub.ts
│       │   └── shared/
│       │       └── schema.ts
│       └── data/
│           ├── store.ts
│           └── seed.ts
│
├── frontend/
│   └── src/
│       ├── main.tsx
│       ├── app/
│       │   ├── app.tsx
│       │   └── providers/
│       │       ├── AntdProvider.tsx
│       │       └── GraphQLProvider.tsx
│       ├── features/
│       │   ├── events/
│       │   │   ├── components/
│       │   │   │   └── EventSelector.tsx
│       │   │   ├── hooks/
│       │   │   │   └── useEvents.ts
│       │   │   ├── graphql/
│       │   │   │   └── events.queries.ts
│       │   │   ├── types.ts
│       │   │   └── index.ts
│       │   ├── feedback-form/
│       │   │   ├── components/
│       │   │   │   └── FeedbackForm.tsx
│       │   │   ├── hooks/
│       │   │   │   └── useSubmitFeedback.ts
│       │   │   ├── graphql/
│       │   │   │   └── feedback.mutations.ts
│       │   │   └── index.ts
│       │   ├── feedback-stream/
│       │   │   ├── components/
│       │   │   │   ├── FeedbackList.tsx
│       │   │   │   └── FeedbackCard.tsx
│       │   │   ├── hooks/
│       │   │   │   └── useFeedbacks.ts
│       │   │   ├── graphql/
│       │   │   │   └── feedback.queries.ts
│       │   │   └── index.ts
│       │   ├── feedback-filters/
│       │   │   ├── components/
│       │   │   │   └── FeedbackFilters.tsx
│       │   │   └── index.ts
│       │   └── realtime/
│       │       ├── hooks/
│       │       │   └── useFeedbackSubscription.ts
│       │       ├── graphql/
│       │       │   └── feedback.subscriptions.ts
│       │       └── index.ts
│       └── shared/
│           ├── graphql/
│           │   └── client.ts
│           └── types/
│
└── frontend-e2e/
    └── src/
        └── feedback-hub.spec.ts
```

---

## Dependencies

### Frontend (to install)
```bash
# Ant Design
npm install antd@latest @ant-design/icons

# GraphQL Client
npm install urql graphql graphql-ws
```

### Backend (already installed)
- fastify
- mercurius
- @fastify/websocket

---

## Ant Design Components Usage

| Feature | Components |
|---------|------------|
| Layout | Layout, Card, Space, Typography |
| Events | Select, Tag |
| Feedback Form | Form, Input.TextArea, Rate, Button, message |
| Feedback Stream | List, Card, Rate, Typography, Empty, Skeleton |
| Filters | Select, Rate |
| Pagination | Pagination |
| Real-time | Badge, notification |
| Loading/Error | Spin, Skeleton, Result, Alert |

---

## Running the Application

```bash
# Start backend
npx nx serve backend

# Start frontend (in another terminal)
npx nx serve frontend

# Run E2E tests
npx nx e2e frontend-e2e
```

---

## GraphQL Schema (Final - built incrementally)

```graphql
type Event {
  id: ID!
  name: String!
  type: EventType!
  date: String!
}

enum EventType {
  WORKSHOP
  WEBINAR
  CONFERENCE
}

type Feedback {
  id: ID!
  eventId: ID!
  text: String!
  rating: Int!
  createdAt: String!
}

type FeedbackConnection {
  items: [Feedback!]!
  totalCount: Int!
}

type Query {
  events: [Event!]!
  feedbacks(eventId: ID!, minRating: Int, limit: Int, offset: Int): FeedbackConnection!
}

type Mutation {
  submitFeedback(eventId: ID!, text: String!, rating: Int!): Feedback!
}

type Subscription {
  feedbackAdded(eventId: ID!): Feedback!
}
```

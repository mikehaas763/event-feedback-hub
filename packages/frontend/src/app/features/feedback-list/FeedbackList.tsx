import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Empty, Skeleton, Space, Button, App } from 'antd';
import { useFeedbacks, FeedbackFilters, Feedback } from './useFeedbacks';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackFiltersBar } from '../feedback-filters';
import { useFeedbackSubscription } from '../realtime';

const PAGE_SIZE = 5;

interface FeedbackListProps {
  eventId: string;
}

export function FeedbackList({ eventId }: FeedbackListProps) {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<FeedbackFilters>({
    first: PAGE_SIZE,
  });
  const [realtimeFeedbacks, setRealtimeFeedbacks] = useState<Feedback[]>([]);
  const pendingNotification = useRef(false);
  
  const { feedbacks, totalCount, hasNextPage, endCursor, fetching } = useFeedbacks(eventId, filters);

  // Clear realtime feedbacks when event changes
  useEffect(() => {
    setRealtimeFeedbacks([]);
    setFilters({ first: PAGE_SIZE });
  }, [eventId]);

  // Show notification after render, not during
  useEffect(() => {
    if (pendingNotification.current) {
      pendingNotification.current = false;
      message.info('New feedback received!');
    }
  }, [realtimeFeedbacks, message]);

  const handleNewFeedback = useCallback((feedback: Feedback) => {
    setRealtimeFeedbacks((prev) => {
      // Avoid duplicates
      if (prev.some((f) => f.id === feedback.id)) {
        return prev;
      }
      pendingNotification.current = true;
      return [feedback, ...prev];
    });
  }, []);

  useFeedbackSubscription(eventId, handleNewFeedback);

  const handleLoadMore = () => {
    setFilters((f) => ({ ...f, after: endCursor ?? undefined }));
  };

  const handleFiltersChange = (newFilters: FeedbackFilters) => {
    // Reset cursor and realtime feedbacks when filters change
    setRealtimeFeedbacks([]);
    setFilters({ ...newFilters, first: PAGE_SIZE, after: undefined });
  };

  // Combine and dedupe feedbacks, then sort by createdAt descending
  const allFeedbacks = useMemo(() => {
    const combined = [...realtimeFeedbacks, ...feedbacks];
    // Dedupe by id
    const seen = new Set<string>();
    const deduped = combined.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
    // Sort by createdAt descending (newest first)
    return deduped.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [realtimeFeedbacks, feedbacks]);

  return (
    <Space direction="vertical" size="middle">
      <FeedbackFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={totalCount + realtimeFeedbacks.length}
      />

      {fetching && allFeedbacks.length === 0 ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : allFeedbacks.length === 0 ? (
        <Empty description="No feedback yet. Be the first!" />
      ) : (
        allFeedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))
      )}

      {hasNextPage && (
        <Button onClick={handleLoadMore} loading={fetching}>
          Load More
        </Button>
      )}
    </Space>
  );
}

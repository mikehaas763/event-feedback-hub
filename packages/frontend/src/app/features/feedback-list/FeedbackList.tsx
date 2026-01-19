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
  const [accumulatedFeedbacks, setAccumulatedFeedbacks] = useState<Feedback[]>([]);
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const pendingNotification = useRef(false);
  const lastAccumulatedKey = useRef<string | null>(null);
  
  const { feedbacks, totalCount, hasNextPage, endCursor, fetching } = useFeedbacks(eventId, filters);

  // Accumulate feedbacks from server responses - only when event+cursor changes
  useEffect(() => {
    // Skip if no feedbacks
    if (feedbacks.length === 0) return;
    
    // Verify feedbacks belong to the current event (avoid stale cache data)
    const feedbacksBelongToCurrentEvent = feedbacks.every((f) => f.eventId === eventId);
    if (!feedbacksBelongToCurrentEvent) return;
    
    // Create a unique key for this event + cursor combination
    const currentKey = `${eventId}:${filters.after ?? 'initial'}`;
    if (lastAccumulatedKey.current === currentKey) return;
    
    lastAccumulatedKey.current = currentKey;
    
    // If this is the initial load for this event, replace; otherwise append
    const isInitialForEvent = !filters.after;
    setAccumulatedFeedbacks((prev) => {
      if (isInitialForEvent) {
        return feedbacks;
      }
      const combined = [...prev, ...feedbacks];
      // Dedupe by id
      const seen = new Set<string>();
      return combined.filter((f) => {
        if (seen.has(f.id)) return false;
        seen.add(f.id);
        return true;
      });
    });
  }, [feedbacks, filters.after, eventId]);

  // Clear everything when event changes
  useEffect(() => {
    setRealtimeFeedbacks([]);
    setAccumulatedFeedbacks([]);
    setDisplayLimit(PAGE_SIZE);
    setFilters({ first: PAGE_SIZE });
    lastAccumulatedKey.current = null;
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

  // Combine realtime + accumulated, dedupe, and sort
  const allFeedbacks = useMemo(() => {
    const combined = [...realtimeFeedbacks, ...accumulatedFeedbacks];
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
  }, [realtimeFeedbacks, accumulatedFeedbacks]);

  // Slice to display limit
  const visibleFeedbacks = useMemo(() => {
    return allFeedbacks.slice(0, displayLimit);
  }, [allFeedbacks, displayLimit]);

  const handleLoadMore = () => {
    const newLimit = displayLimit + PAGE_SIZE;
    setDisplayLimit(newLimit);
    
    // If we need more from the server, fetch the next page
    if (newLimit > allFeedbacks.length && hasNextPage) {
      setFilters((f) => ({ ...f, after: endCursor ?? undefined }));
    }
  };

  const handleFiltersChange = (newFilters: FeedbackFilters) => {
    // Reset everything when filters change
    setRealtimeFeedbacks([]);
    setAccumulatedFeedbacks([]);
    setDisplayLimit(PAGE_SIZE);
    setFilters({ ...newFilters, first: PAGE_SIZE, after: undefined });
  };

  // Total count includes realtime additions
  const actualTotalCount = totalCount + realtimeFeedbacks.length;
  
  // Show load more if there are more items locally OR more on server
  const showLoadMore = displayLimit < allFeedbacks.length || hasNextPage;

  return (
    <Space direction="vertical" size="middle">
      <FeedbackFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={actualTotalCount}
      />

      {fetching && visibleFeedbacks.length === 0 ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : visibleFeedbacks.length === 0 ? (
        <Empty description="No feedback yet. Be the first!" />
      ) : (
        visibleFeedbacks.map((feedback) => (
          <FeedbackCard key={feedback.id} feedback={feedback} />
        ))
      )}

      {showLoadMore && (
        <Button onClick={handleLoadMore} loading={fetching}>
          Load More
        </Button>
      )}
    </Space>
  );
}

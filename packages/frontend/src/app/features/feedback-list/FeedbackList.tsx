import { useState } from 'react';
import { Empty, Skeleton, Space, Button } from 'antd';
import { useFeedbacks, FeedbackFilters } from './useFeedbacks';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackFiltersBar } from '../feedback-filters';

const PAGE_SIZE = 5;

interface FeedbackListProps {
  eventId: string;
}

export function FeedbackList({ eventId }: FeedbackListProps) {
  const [filters, setFilters] = useState<FeedbackFilters>({
    first: PAGE_SIZE,
  });
  
  const { feedbacks, totalCount, hasNextPage, endCursor, fetching } = useFeedbacks(eventId, filters);

  const handleLoadMore = () => {
    setFilters((f) => ({ ...f, after: endCursor ?? undefined }));
  };

  const handleFiltersChange = (newFilters: FeedbackFilters) => {
    // Reset cursor when filters change
    setFilters({ ...newFilters, first: PAGE_SIZE, after: undefined });
  };

  return (
    <Space direction="vertical" size="middle">
      <FeedbackFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={totalCount}
      />

      {fetching && feedbacks.length === 0 ? (
        <>
          <Skeleton active />
          <Skeleton active />
        </>
      ) : feedbacks.length === 0 ? (
        <Empty description="No feedback yet. Be the first!" />
      ) : (
        feedbacks.map((feedback) => (
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

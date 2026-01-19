import { Empty, Skeleton, Space } from 'antd';
import { useFeedbacks } from './useFeedbacks';
import { FeedbackCard } from './FeedbackCard';

interface FeedbackListProps {
  eventId: string;
  refetchKey?: number;
}

export function FeedbackList({ eventId, refetchKey }: FeedbackListProps) {
  const { feedbacks, fetching } = useFeedbacks(eventId);

  if (fetching) {
    return (
      <Space direction="vertical" size="middle">
        <Skeleton active />
        <Skeleton active />
      </Space>
    );
  }

  if (feedbacks.length === 0) {
    return <Empty description="No feedback yet. Be the first!" />;
  }

  return (
    <Space direction="vertical" size="middle">
      {feedbacks.map((feedback) => (
        <FeedbackCard key={feedback.id} feedback={feedback} />
      ))}
    </Space>
  );
}

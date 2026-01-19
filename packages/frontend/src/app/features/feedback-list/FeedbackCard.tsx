import { Card, Rate, Typography } from 'antd';
import { Feedback } from './useFeedbacks';

const { Text, Paragraph } = Typography;

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const formattedDate = new Date(feedback.createdAt).toLocaleString();

  return (
    <Card size="small">
      <Rate disabled value={feedback.rating} />
      <Paragraph>{feedback.text}</Paragraph>
      <Text type="secondary">{formattedDate}</Text>
    </Card>
  );
}

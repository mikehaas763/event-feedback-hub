import { Select, Space, Typography } from 'antd';
import { FeedbackFilters } from '../feedback-list/useFeedbacks';

const { Text } = Typography;

interface FeedbackFiltersBarProps {
  filters: FeedbackFilters;
  onChange: (filters: FeedbackFilters) => void;
  totalCount: number;
}

const ratingOptions = [
  { value: 0, label: 'All Ratings' },
  { value: 1, label: '1+ Stars' },
  { value: 2, label: '2+ Stars' },
  { value: 3, label: '3+ Stars' },
  { value: 4, label: '4+ Stars' },
  { value: 5, label: '5 Stars' },
];

export function FeedbackFiltersBar({ filters, onChange, totalCount }: FeedbackFiltersBarProps) {
  return (
    <Space>
      <Text type="secondary">Filter by rating:</Text>
      <Select
        value={filters.minRating ?? 0}
        onChange={(value) => onChange({ ...filters, minRating: value === 0 ? undefined : value })}
        options={ratingOptions}
      />
      <Text type="secondary">
        {totalCount} feedback{totalCount !== 1 ? 's' : ''} total
      </Text>
    </Space>
  );
}

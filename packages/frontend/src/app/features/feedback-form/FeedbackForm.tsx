import { Form, Input, Rate, Button, App } from 'antd';
import { useSubmitFeedback } from './useSubmitFeedback';

const { TextArea } = Input;

interface FeedbackFormProps {
  eventId: string;
}

interface FormValues {
  text: string;
  rating: number;
}

export function FeedbackForm({ eventId }: FeedbackFormProps) {
  const [form] = Form.useForm<FormValues>();
  const { message } = App.useApp();
  const { submitFeedback, submitting } = useSubmitFeedback();

  const handleSubmit = async (values: FormValues) => {
    const result = await submitFeedback(eventId, values.text, values.rating);
    if (result.data) {
      message.success('Feedback submitted successfully!');
      form.resetFields();
    } else if (result.error) {
      message.error('Failed to submit feedback');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ rating: 3 }}
    >
      <Form.Item
        name="rating"
        label="Rating"
        rules={[{ required: true, message: 'Please provide a rating' }]}
      >
        <Rate />
      </Form.Item>

      <Form.Item
        name="text"
        label="Your Feedback"
        rules={[{ required: true, message: 'Please enter your feedback' }]}
      >
        <TextArea rows={4} placeholder="Share your experience..." />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Submit Feedback
        </Button>
      </Form.Item>
    </Form>
  );
}

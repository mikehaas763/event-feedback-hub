import { useState } from 'react';
import { Layout, Card, Typography, ConfigProvider, theme, Row, Col, Descriptions } from 'antd';
import { EventSelector, Event } from './features/events';

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;

export function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <Layout>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Header>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>Event Feedback Hub</Text>
            </Col>
          </Row>
        </Header>
      </ConfigProvider>
      <Content>
        <Card title="Select an Event">
          <Paragraph type="secondary">
            Choose an event to view feedback and submit your own.
          </Paragraph>
          <EventSelector
            value={selectedEvent?.id}
            onChange={(_, event) => setSelectedEvent(event)}
          />
        </Card>

        {selectedEvent && (
          <Card title={selectedEvent.name}>
            <Descriptions column={1}>
              <Descriptions.Item label="Type">{selectedEvent.type}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedEvent.date}</Descriptions.Item>
            </Descriptions>
            <Paragraph type="secondary">
              Feedback submission coming soon...
            </Paragraph>
          </Card>
        )}
      </Content>
    </Layout>
  );
}
export default App;

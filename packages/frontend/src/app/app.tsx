import { Layout, Card, Typography, ConfigProvider, theme, Row, Col } from 'antd';
import { useQuery } from 'urql';

const { Header, Content } = Layout;
const { Text, Paragraph } = Typography;

const HELLO_QUERY = `
  query Hello {
    hello
  }
`;

export function App() {
  const [result] = useQuery({ query: HELLO_QUERY });

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
        <Card title="Welcome to Event Feedback Hub!">
          <Paragraph type="secondary">
            Share your feedback on events you've attended (workshops, webinars, conferences) 
            and view others' feedback in real-time.
          </Paragraph>
          <Paragraph>
            {result.data?.hello}
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}
export default App;

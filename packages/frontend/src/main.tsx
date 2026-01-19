import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { AntdProvider, GraphQLProvider } from './app/providers';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <AntdProvider>
      <GraphQLProvider>
        <App />
      </GraphQLProvider>
    </AntdProvider>
  </StrictMode>
);

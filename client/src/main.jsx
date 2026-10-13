import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initSentry } from './services/sentry';
import ErrorBoundary from './components/common/ErrorBoundary';
import App from './App';
import './styles/index.css';

// Initialize Sentry error monitoring at entry point
initSentry();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

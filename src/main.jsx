import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';

const shouldUseStrictMode =
  process.env.NODE_ENV !== 'development' ||
  process.env.REACT_APP_ENABLE_STRICT_MODE === 'true' ||
  process.env.VITE_ENABLE_STRICT_MODE === 'true';

const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  shouldUseStrictMode ? <React.StrictMode>{app}</React.StrictMode> : app
);

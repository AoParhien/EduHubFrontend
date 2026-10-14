import React from 'react';
import './ErrorBoundary.css';

// Wraps the whole app, outside ChakraProvider, so it uses plain HTML and CSS.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EduHubFrontend render failure', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="app-error">
        <div className="app-error__card">
          <img src="/Dblue.png" alt="AoParhein" className="app-error__logo" />
          <h1>This page stopped working</h1>
          <p>
            Something went wrong while showing this page. Reloading usually fixes it. If you were reserving a seat,
            check My courses before trying again so you don't book twice.
          </p>
          <div className="app-error__actions">
            <button type="button" className="app-error__primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a href="/" className="app-error__secondary">Go to home page</a>
          </div>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;

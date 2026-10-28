import React, { Component, lazy, Suspense } from 'react';

const ErrorPage = lazy(() => import('../../pages/error/ErrorPage'));

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#FAF9F6] p-8 flex items-center justify-center font-serif text-lg text-[#101010]">
              A temporary anomaly occurred. Please reload the page.
            </div>
          }
        >
          <ErrorPage
            error={this.state.error}
            resetErrorBoundary={this.handleReset}
          />
        </Suspense>
      );
    }

    return this.props.children;
  }
}

import React from 'react';
import { captureFrontendException } from '../../services/sentry';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🔥 [VEXIVO ErrorBoundary] Caught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
    captureFrontendException(error, { extra: errorInfo });
  }

  handleClearCacheAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-neutral-200/80 p-8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              ⚠️
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Something went wrong</h2>
              <p className="text-xs text-neutral-500 mt-1">
                A client runtime error was safely intercepted by VEXIVO Error Boundary.
              </p>
            </div>

            <div className="text-left bg-neutral-900 text-neutral-200 text-xs p-4 rounded-xl font-mono overflow-x-auto max-h-48 border border-neutral-800">
              <p className="text-rose-400 font-bold mb-1">{this.state.error?.name || 'Error'}:</p>
              <p className="whitespace-pre-wrap break-words">{this.state.error?.message || 'Unknown runtime error'}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleClearCacheAndReload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                Clear Local Cache &amp; Reset
              </button>
              <a
                href="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition text-center"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

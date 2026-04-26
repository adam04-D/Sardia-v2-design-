import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureException } from '../lib/sentry';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Sentry no-ops gracefully when DSN isn't set.
    captureException(error, { extra: { componentStack: info.componentStack } });
    if (import.meta.env.DEV) {
      console.error('App crashed:', error, info);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center px-6 bg-surface"
      >
        <div className="max-w-md text-center space-y-6">
          <h1 className="font-serif text-4xl text-primary">حدث خطأ غير متوقع</h1>
          <p className="font-sans text-text-muted leading-relaxed">
            نعتذر عن هذا الإزعاج. يمكنك إعادة تحميل الصفحة والمحاولة مرة أخرى.
          </p>
          {this.state.error?.message && (
            <p className="font-sans text-xs text-stone-400 break-words">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReload}
            className="bg-primary text-surface px-8 py-3 rounded-full font-sans text-sm font-bold hover:bg-accent transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }
}

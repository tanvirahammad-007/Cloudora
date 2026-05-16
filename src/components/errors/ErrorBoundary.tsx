import { Component, ErrorInfo, ReactNode, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { useErrors } from '../../context/ErrorContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryBase extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-color)] p-6 text-[var(--text-main)]">
          <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-2xl flex-col items-center justify-center text-center">
            <div className="glass-panel flex w-full flex-col items-center gap-6 rounded-[3rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/95 p-8 shadow-[0_30px_100px_-60px_rgba(14,165,233,0.8)]">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-400/15 bg-sky-400/10 text-sky-300">
                <RefreshCw size={32} strokeWidth={1.8} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight">Cloudora needs a quick refresh</h1>
                <p className="mx-auto max-w-md text-sm font-semibold leading-relaxed text-[var(--text-muted)]">
                  The dashboard hit an unexpected issue. Your saved settings are safe.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-2xl bg-[var(--text-main)] px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--bg-color)] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                Reload dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  const { reportError } = useErrors();

  const handleError = useCallback((error: Error, info: ErrorInfo) => {
    reportError(error, {
      kind: 'runtime',
      source: 'react-boundary',
      message: info.componentStack ? 'A dashboard view failed to render. Please refresh this view.' : undefined,
    });
  }, [reportError]);

  return <ErrorBoundaryBase onError={handleError}>{children}</ErrorBoundaryBase>;
}

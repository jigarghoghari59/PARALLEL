// src/components/common/ErrorBoundary.jsx
import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[PARALLEL ErrorBoundary caught an error]:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-paper text-ink flex items-center justify-center p-6 select-none">
          <div className="bg-card border border-rule rounded-card p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            <div className="w-14 h-14 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6">
              <AlertTriangle size={28} aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-ink mb-2.5">
              Timeline diverged unexpectedly
            </h2>

            <p className="text-sm text-muted leading-relaxed mb-6">
              A temporary anomaly interrupted the multiverse render tree. You can reload this timeline or return safely to your central hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-ink font-semibold text-xs hover:bg-accent-muted transition-colors shadow-md active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              >
                <RefreshCw size={13} aria-hidden="true" /> Re-align timeline
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-surface border border-rule hover:border-white/20 text-ink text-xs font-semibold transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
              >
                <Home size={13} aria-hidden="true" /> Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

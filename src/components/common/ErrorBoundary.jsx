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
        <div className="min-h-screen bg-[#050505] text-[#F2F3F0] flex items-center justify-center p-6 select-none">
          <div className="bg-[#0B0D0E]/95 border border-[#292C2C] rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={32} />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-red-950/20 border border-red-500/20 text-red-300 text-[10px] font-bold tracking-widest uppercase mb-3">
              Quantum Desynchronization
            </span>

            <h2 className="text-2xl font-extrabold text-[#F2F3F0] mb-3">
              Something Diverged Unexpectedly
            </h2>

            <p className="text-xs text-[#A5A7A3] leading-relaxed mb-6">
              A temporary anomaly interrupted the multiverse render tree. You can reload this timeline or return safely to your central hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs uppercase tracking-wider hover:bg-[#d8f5be] transition-all shadow-md"
              >
                <RefreshCw size={13} /> Re-align Timeline
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B0D0E] border border-[#292C2C] text-[#F2F3F0] text-xs font-semibold hover:bg-[#141618] transition-colors"
              >
                <Home size={13} /> Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
          <div className="glass-card rounded-xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl relative overflow-hidden reflection-sheen">
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="w-14 h-14 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={28} />
            </div>

            <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-950/20 border border-red-500/20 text-red-300 text-[10px] font-bold tracking-widest uppercase mb-3">
              Quantum Desynchronization
            </span>

            <h2 className="text-xl font-extrabold text-[#F2F3F0] mb-2.5">
              Something Diverged Unexpectedly
            </h2>

            <p className="text-xs text-[#A5A7A3] leading-relaxed mb-6">
              A temporary anomaly interrupted the multiverse render tree. You can reload this timeline or return safely to your central hub.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-b from-[#D4F2B7] to-[#B5E090] text-[#050505] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(200,233,169,0.4)] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw size={13} /> Re-align Timeline
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg glass-pill hover:border-[#C8E9A9]/50 text-[#F2F3F0] text-xs font-semibold transition-all active:scale-95"
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

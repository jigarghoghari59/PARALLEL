import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { UniverseProvider } from './context/UniverseContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ParallelLoader } from './components/common/ParallelLoader';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CreateUniverse from './pages/CreateUniverse';
import Explorer from './pages/Explorer';
import TimelineDetails from './pages/TimelineDetails';
import Compare from './pages/Compare';
import Simulate from './pages/Simulate';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  const appContentRef = useRef(null);

  // The landing page settles into place while the loader's portals open.
  // Transform-only (no blur on a WebGL page), origin pinned near the hero, and
  // cleared afterwards so `position: fixed` children (the nav) behave normally.
  const handleTransitionStart = () => {
    const el = appContentRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const origin = `50% ${Math.round(window.innerHeight * 0.45)}px`;
    gsap.fromTo(
      el,
      { scale: 1.06, transformOrigin: origin },
      {
        scale: 1,
        transformOrigin: origin,
        duration: 1.8,
        ease: "expo.out",
        clearProps: "transform,transformOrigin",
      }
    );
  };

  return (
    <ErrorBoundary>
      <ParallelLoader onTransitionStart={handleTransitionStart} />
      <div ref={appContentRef} className="w-full min-h-dvh">
        <Router>
          <UniverseProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create" element={<CreateUniverse />} />
                <Route path="/explore" element={<Explorer />} />
                <Route path="/explore/:universeId" element={<Explorer />} />
                <Route path="/universe/:universeId/reality/:realityId" element={<TimelineDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/simulate/:universeId/:realityId" element={<Simulate />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/archive" element={<Saved />} />
                <Route path="/settings" element={<Settings />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </UniverseProvider>
        </Router>
      </div>
    </ErrorBoundary>
  );
};

export default App;

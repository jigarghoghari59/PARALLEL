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

  const handleTransitionStart = () => {
    if (appContentRef.current) {
      gsap.fromTo(
        appContentRef.current,
        { scale: 1.035, filter: "blur(6px)", opacity: 0.8 },
        { scale: 1.0, filter: "blur(0px)", opacity: 1.0, duration: 1.15, ease: "power3.out" }
      );
    }
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

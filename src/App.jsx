import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { UniverseProvider } from './context/UniverseContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import CreateUniverse from './pages/CreateUniverse';
import Explorer from './pages/Explorer';
import TimelineDetails from './pages/TimelineDetails';
import Compare from './pages/Compare';
import Simulate from './pages/Simulate';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => (
  <ErrorBoundary>
    <Router>
      <UniverseProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
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
  </ErrorBoundary>
);

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { PersonalizeScreen } from './screens/PersonalizeScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { AppShell } from './components/AppShell';

function Shell({ children, hideNav }: { children: React.ReactNode; hideNav?: boolean }) {
  return <AppShell hideNav={hideNav}>{children}</AppShell>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Shell><HomeScreen /></Shell>} />
      <Route path="/personalize" element={<Shell><PersonalizeScreen /></Shell>} />
      <Route path="/preview/:id" element={<Shell><PreviewScreen /></Shell>} />
      <Route path="/player/:id" element={<Shell hideNav><PlayerScreen /></Shell>} />
      <Route path="/feedback" element={<Shell><FeedbackScreen /></Shell>} />
      <Route path="/progress" element={<Shell><ProgressScreen /></Shell>} />
    </Routes>
  );
}

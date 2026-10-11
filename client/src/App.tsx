import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { PreviewScreen } from './screens/PreviewScreen';
import { PlayerScreen } from './screens/PlayerScreen';
import { PersonalizeScreen } from './screens/PersonalizeScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';
import { ProgressScreen } from './screens/ProgressScreen';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/personalize" element={<PersonalizeScreen />} />
      <Route path="/preview/:id" element={<PreviewScreen />} />
      <Route path="/player/:id" element={<PlayerScreen />} />
      <Route path="/feedback" element={<FeedbackScreen />} />
      <Route path="/progress" element={<ProgressScreen />} />
    </Routes>
  );
}

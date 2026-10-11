import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { CompletedWorkout, DifficultyRating } from '../types/workout';
import { loadHistory, saveHistory } from '../utils/storage';

export function FeedbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const record = (location.state as { record?: CompletedWorkout })?.record;
  const [selected, setSelected] = useState<DifficultyRating | null>(null);

  const saveRating = (rating: DifficultyRating) => {
    setSelected(rating);
    if (record) {
      const history = loadHistory();
      const idx = history.findIndex((h) => h.id === record.id);
      if (idx >= 0) {
        history[idx] = { ...history[idx], difficultyRating: rating };
        saveHistory(history);
      }
    }
  };

  return (
    <div className="page-pad" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
      <p className="overline">Session complete</p>
      <h1>How did that feel?</h1>
      {record && (
        <p className="lede">
          You finished <strong>{record.completedExercises}</strong> of{' '}
          <strong>{record.totalExercises}</strong> exercises in{' '}
          <strong>{Math.round(record.actualDurationSeconds / 60)}</strong> minutes.
        </p>
      )}

      <div className="choice-row" style={{ justifyContent: 'center', marginTop: 32 }}>
        {([
          ['too_easy', 'Too easy'],
          ['just_right', 'Just right'],
          ['too_hard', 'Too hard'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`choice-chip ${selected === value ? 'active' : ''}`}
            onClick={() => saveRating(value)}
          >
            {selected === value && <Check size={14} />} {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40 }}>
        <button type="button" className="button primary" onClick={() => navigate('/progress')}>
          View progress
        </button>
        <button type="button" className="button secondary" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    </div>
  );
}

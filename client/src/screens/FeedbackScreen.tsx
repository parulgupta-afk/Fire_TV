import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Focusable } from '../components/Focusable';
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
    <div className="app-shell" style={{ textAlign: 'center' }}>
      <h1>Session Complete</h1>
      {record && (
        <p>
          You finished <strong>{record.completedExercises}</strong> of{' '}
          <strong>{record.totalExercises}</strong> exercises in{' '}
          <strong>{Math.round(record.actualDurationSeconds / 60)}</strong> minutes.
        </p>
      )}

      <h2 style={{ marginTop: 40 }}>How did that feel?</h2>
      <div className="row" style={{ justifyContent: 'center', marginTop: 24 }}>
        <Focusable
          as="button"
          className={`btn ${selected === 'too_easy' ? 'btn-primary' : 'btn-ghost'}`}
          onSelect={() => saveRating('too_easy')}
        >
          Too Easy
        </Focusable>
        <Focusable
          as="button"
          className={`btn ${selected === 'just_right' ? 'btn-primary' : 'btn-ghost'}`}
          autoFocus
          onSelect={() => saveRating('just_right')}
        >
          Just Right
        </Focusable>
        <Focusable
          as="button"
          className={`btn ${selected === 'too_hard' ? 'btn-primary' : 'btn-ghost'}`}
          onSelect={() => saveRating('too_hard')}
        >
          Too Hard
        </Focusable>
      </div>

      <div className="row" style={{ justifyContent: 'center', marginTop: 48 }}>
        <Focusable as="button" className="btn btn-primary" onSelect={() => navigate('/progress')}>
          View Progress
        </Focusable>
        <Focusable as="button" className="btn btn-ghost" onSelect={() => navigate('/')}>
          Home
        </Focusable>
      </div>
    </div>
  );
}

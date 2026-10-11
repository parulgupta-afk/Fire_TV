import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Focusable } from '../components/Focusable';
import { loadHistory } from '../utils/storage';
import { totalMinutes, calculateStreak } from '../features/workouts/workoutEngine';

export function ProgressScreen() {
  const navigate = useNavigate();
  const history = loadHistory();
  const mins = totalMinutes(history);
  const streak = calculateStreak(history);

  return (
    <div className="app-shell">
      <Focusable as="button" className="btn btn-ghost" onSelect={() => navigate('/')} style={{ marginBottom: 24 }}>
        ← Home
      </Focusable>

      <h1>Your Progress</h1>

      <div className="row" style={{ margin: '32px 0', gap: 48 }}>
        <div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{history.length}</div>
          <div style={{ color: 'var(--text-muted)' }}>Total Sessions</div>
        </div>
        <div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{mins}</div>
          <div style={{ color: 'var(--text-muted)' }}>Minutes</div>
        </div>
        <div>
          <div style={{ fontSize: 48, fontWeight: 800 }}>{streak}</div>
          <div style={{ color: 'var(--text-muted)' }}>Day Streak</div>
        </div>
      </div>

      <h2 style={{ marginBottom: 16 }}>Recent Sessions</h2>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No workouts yet. Complete your first session!</p>
          <Focusable as="button" className="btn btn-primary" onSelect={() => navigate('/')}>
            Start a Workout
          </Focusable>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
          {history.slice(0, 15).map((h) => (
            <div key={h.id} className="card" style={{ padding: '16px 20px' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{h.title}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>
                  {new Date(h.completedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="row" style={{ gap: 12, marginTop: 6, fontSize: 18 }}>
                <span>
                  {h.completedExercises}/{h.totalExercises} exercises
                </span>
                <span>·</span>
                <span>{Math.round(h.actualDurationSeconds / 60)} min</span>
                {h.difficultyRating && (
                  <>
                    <span>·</span>
                    <span style={{ textTransform: 'capitalize' }}>
                      {h.difficultyRating.replace('_', ' ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

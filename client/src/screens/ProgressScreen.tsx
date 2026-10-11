import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { loadHistory } from '../utils/storage';
import { totalMinutes, calculateStreak } from '../features/workouts/workoutEngine';

export function ProgressScreen() {
  const navigate = useNavigate();
  const history = loadHistory();
  const mins = totalMinutes(history);
  const streak = calculateStreak(history);

  return (
    <div className="page-pad">
      <button type="button" className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Home
      </button>

      <header className="page-header" style={{ marginTop: 18 }}>
        <div>
          <p className="overline">Progress</p>
          <h1>Your training log</h1>
        </div>
      </header>

      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card lime">
          <p className="overline">Sessions</p>
          <strong style={{ fontSize: 36 }}>{history.length}</strong>
        </div>
        <div className="stat-card coral">
          <p className="overline">Minutes</p>
          <strong style={{ fontSize: 36 }}>{mins}</strong>
        </div>
        <div className="stat-card violet">
          <p className="overline">Streak</p>
          <strong style={{ fontSize: 36 }}>{streak}</strong>
        </div>
        <div className="insight-card">
          <div className="chart-header">
            <Trophy size={16} />
            <span>Consistency</span>
          </div>
          <p style={{ margin: '12px 0 0', color: 'var(--muted)' }}>
            Rate sessions after each workout so recommendations stay honest.
          </p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="overline">History</p>
          <h2>Recent sessions</h2>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No workouts yet. Complete your first session!</p>
          <button type="button" className="button primary" onClick={() => navigate('/')}>
            Start a workout
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.slice(0, 15).map((h) => (
            <div key={h.id} className="history-item">
              <div>
                <strong>{h.title}</strong>
                <p>
                  {h.completedExercises}/{h.totalExercises} exercises ·{' '}
                  {Math.round(h.actualDurationSeconds / 60)} min
                  {h.difficultyRating
                    ? ` · ${h.difficultyRating.replace('_', ' ')}`
                    : ''}
                </p>
              </div>
              <span className="history-date">
                {new Date(h.completedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

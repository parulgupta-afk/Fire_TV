import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCurated } from '../data/curatedWorkouts';
import { Focusable } from '../components/Focusable';
import { loadHistory } from '../utils/storage';
import { totalMinutes, calculateStreak } from '../features/workouts/workoutEngine';

export function HomeScreen() {
  const navigate = useNavigate();
  const curated = getAllCurated();
  const history = loadHistory();
  const mins = totalMinutes(history);
  const streak = calculateStreak(history);

  return (
    <div className="app-shell">
      <header style={{ marginBottom: 40 }}>
        <h1>FitTV AI</h1>
        <p>Your living-room fitness coach</p>
      </header>

      <div className="row" style={{ marginBottom: 40 }}>
        <Focusable
          as="button"
          className="btn btn-primary"
          autoFocus
          onSelect={() => navigate('/personalize')}
        >
          Start Personalized Workout
        </Focusable>
        <Focusable
          as="button"
          className="btn btn-ghost"
          onSelect={() => navigate('/progress')}
        >
          Progress
        </Focusable>
      </div>

      <div className="row" style={{ marginBottom: 32, gap: 32 }}>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{history.length}</div>
          <div style={{ color: 'var(--text-muted)' }}>Sessions</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{mins}</div>
          <div style={{ color: 'var(--text-muted)' }}>Minutes</div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{streak}</div>
          <div style={{ color: 'var(--text-muted)' }}>Day Streak</div>
        </div>
      </div>

      <h2 style={{ marginBottom: 20 }}>Ready to Start</h2>
      <div className="grid grid-3">
        {curated.map((w, idx) => (
          <Focusable
            key={w.id}
            className="card"
            onSelect={() => navigate(`/preview/${w.id}`)}
          >
            <h3>{w.title}</h3>
            <p style={{ marginBottom: 12 }}>{w.goal}</p>
            <div className="row" style={{ gap: 8 }}>
              <span className="badge badge-beginner">{w.level}</span>
              <span className="badge">{w.estimatedDurationMinutes} min</span>
              <span className={`badge ${w.impact === 'low' ? 'badge-low' : ''}`}>
                {w.impact} impact
              </span>
            </div>
          </Focusable>
        ))}
      </div>

      <div className="dev-hint">
        Local dev: Use Tab / Arrow keys + Enter. On Fire TV use the remote.
      </div>
    </div>
  );
}

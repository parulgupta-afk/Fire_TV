import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Clock3, Flame, Sparkles, Target, Trophy } from 'lucide-react';
import { getAllCurated } from '../data/curatedWorkouts';
import { loadHistory } from '../utils/storage';
import { totalMinutes, calculateStreak } from '../features/workouts/workoutEngine';
import { api } from '../services/api';

const accents = ['lime', 'coral', 'violet', 'blue'] as const;

export function HomeScreen() {
  const navigate = useNavigate();
  const curated = getAllCurated();
  const history = loadHistory();
  const mins = totalMinutes(history);
  const streak = calculateStreak(history);
  const [rec, setRec] = useState<string | null>(null);

  useEffect(() => {
    api.getRecommendation().then((r) => setRec(r.message)).catch(() => setRec(null));
  }, []);

  return (
    <div className="page-pad">
      <header className="page-header">
        <div>
          <p className="overline">Tonight on FitTV</p>
          <h1>Train in the living room</h1>
          <p className="lede">
            Structured plans, remote-friendly coaching, and quick adaptations when time or energy shifts.
          </p>
        </div>
        <button type="button" className="button primary" onClick={() => navigate('/personalize')}>
          <Sparkles size={16} />
          Personalize workout
        </button>
      </header>

      {rec && (
        <div className="coach-callout" style={{ marginBottom: 28 }}>
          <Sparkles size={18} />
          <div>
            <strong>Coach tip</strong>
            <p>{rec}</p>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card lime">
          <p className="overline">Sessions</p>
          <strong style={{ fontSize: 36 }}>{history.length}</strong>
          <span>Completed</span>
        </div>
        <div className="stat-card coral">
          <p className="overline">Minutes</p>
          <strong style={{ fontSize: 36 }}>{mins}</strong>
          <span>Active time</span>
        </div>
        <div className="stat-card violet">
          <p className="overline">Streak</p>
          <strong style={{ fontSize: 36 }}>{streak}</strong>
          <span>Days</span>
        </div>
        <div className="insight-card">
          <div className="chart-header">
            <Trophy size={16} />
            <span>Keep the rhythm</span>
          </div>
          <p style={{ margin: '12px 0 0', color: 'var(--muted)' }}>
            Start a short curated session or generate a plan that matches your energy tonight.
          </p>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="overline">Ready to start</p>
          <h2>Curated for the couch</h2>
        </div>
        <button type="button" className="text-button" onClick={() => navigate('/personalize')}>
          Generate new <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="explore-grid">
        {curated.map((w, i) => (
          <button
            key={w.id}
            type="button"
            className={`explore-card ${accents[i % accents.length]}`}
            onClick={() => navigate(`/preview/${w.id}`)}
          >
            <div className="explore-card-body">
              <p className="card-eyebrow">{w.goal}</p>
              <h3>{w.title}</h3>
              <p>{w.coachNotes || w.goal}</p>
              <div className="meta-row">
                <span><Clock3 size={13} /> {w.estimatedDurationMinutes} min</span>
                <span><Target size={13} /> {w.level}</span>
                <span><Flame size={13} /> {w.impact}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  Dumbbell,
  Flame,
  Leaf,
  Play,
  Sparkles,
  Trophy,
  WandSparkles,
} from 'lucide-react';
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
    api
      .getRecommendation(history)
      .then((r) => setRec(r.message))
      .catch(() => setRec(null));
  }, []);

  const firstCurated = curated[0];

  return (
    <div className="page-section">
      {/* INTRO / HERO — from design */}
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="section-kicker">
            <span className="live-dot" /> Adaptive coach · Living room
          </div>
          <h1>
            Make space for
            <br />
            <em>your better.</em>
          </h1>
          <p>One focused session, shaped around how you feel today.</p>
          <div className="hero-actions">
            <button type="button" className="button primary" onClick={() => navigate('/personalize')}>
              <Sparkles size={18} /> Start adaptive session <ArrowRight size={18} />
            </button>
            {firstCurated && (
              <button
                type="button"
                className="button quiet"
                onClick={() => navigate(`/preview/${firstCurated.id}`)}
              >
                <Play size={17} /> Quick start
              </button>
            )}
          </div>
          <div className="hero-note">
            <span>
              <Check size={14} /> No equipment
            </span>
            <span>
              <Clock3 size={14} /> 12–20 min
            </span>
            <span>
              <Leaf size={14} /> Low impact
            </span>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-ring ring-one" />
          <div className="orbit-ring ring-two" />
          <div className="orbit-ring ring-three" />
          <div className="orbit-core">
            <Dumbbell size={34} />
          </div>
          <span className="orbit-tag tag-top">TODAY&apos;S FOCUS</span>
          <span className="orbit-tag tag-bottom">MOVE BETTER</span>
        </div>
      </section>


      {/* Quick starts */}
      <div className="section-heading" style={{ marginTop: 8 }}>
        <div>
          <p className="overline">Quick start</p>
          <h2>Jump in without setup.</h2>
        </div>
      </div>
      <div className="choice-row" style={{ marginBottom: 28 }}>
        <button type="button" className="button secondary" onClick={() => navigate('/preview/curated-quick-cardio')}>
          12-min low-impact cardio
        </button>
        <button type="button" className="button secondary" onClick={() => navigate('/preview/curated-beginner-bodyweight')}>
          15-min beginner full body
        </button>
        <button type="button" className="button secondary" onClick={() => navigate('/preview/curated-core-focus')}>
          14-min gentle core
        </button>
        <button type="button" className="button primary" onClick={() => navigate('/personalize')}>
          Personalize
        </button>
      </div>

      {/* Stats */}
      <div className="section-heading">
        <div>
          <p className="overline">Your rhythm</p>
          <h2>Small wins, visible.</h2>
        </div>
        <button type="button" className="text-button" onClick={() => navigate('/progress')}>
          See progress <ArrowRight size={15} />
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card lime">
          <div className="stat-top">
            <span className="stat-icon">
              <Flame size={18} />
            </span>
            <span className="stat-label">Current streak</span>
          </div>
          <strong>{streak} days</strong>
          <span className="stat-detail">Keep showing up</span>
        </div>
        <div className="stat-card coral">
          <div className="stat-top">
            <span className="stat-icon">
              <Clock3 size={18} />
            </span>
            <span className="stat-label">Active minutes</span>
          </div>
          <strong>{mins}</strong>
          <span className="stat-detail">Total logged</span>
        </div>
        <div className="stat-card violet">
          <div className="stat-top">
            <span className="stat-icon">
              <Trophy size={18} />
            </span>
            <span className="stat-label">Sessions done</span>
          </div>
          <strong>{history.length}</strong>
          <span className="stat-detail">In this device</span>
        </div>
        <div className="insight-card">
          <div className="insight-label">
            <WandSparkles size={16} /> Coach insight
          </div>
          <p>
            {rec ||
              'Start with a short low-impact session. Rate how it felt so the coach can adapt.'}
          </p>
          <div className="insight-footer">
            <span>Based on your feedback</span>
            <ArrowUpRight size={15} />
          </div>
        </div>
      </section>

      {/* Curated workouts */}
      <div className="section-heading workout-heading">
        <div>
          <p className="overline">Curated for your week</p>
          <h2>Find your next move.</h2>
        </div>
        <button type="button" className="text-button" onClick={() => navigate('/personalize')}>
          Generate plan <ArrowRight size={15} />
        </button>
      </div>

      <section className="workout-rail">
        {curated.map((w, i) => (
          <button
            key={w.id}
            type="button"
            className="workout-card"
            onClick={() => navigate(`/preview/${w.id}`)}
          >
            <div className={`workout-visual ${accents[i % accents.length]}`} aria-hidden>
              <div className="sun-orb" />
              <div className="figure-head" />
              <div className="figure-body" />
              <span className="visual-label">FITTV / 0{i + 1}</span>
            </div>
            <div className="workout-content">
              <span className="card-eyebrow">{w.goal}</span>
              <h3>{w.title}</h3>
              <p>
                {w.level} · {w.impact} impact
              </p>
              <div className="workout-meta">
                <span>{w.estimatedDurationMinutes} min</span>
                <span>{w.level}</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}

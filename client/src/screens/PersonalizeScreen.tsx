import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Focusable } from '../components/Focusable';
import { api } from '../services/api';
import { getAllCurated } from '../data/curatedWorkouts';

const GOALS = ['Build strength', 'Improve mobility', 'Raise energy', 'Core stability'];
const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const DURATIONS = [10, 15, 20, 30];
const IMPACTS = ['low', 'standard'] as const;

export function PersonalizeScreen() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(GOALS[0]);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('beginner');
  const [duration, setDuration] = useState(15);
  const [impact, setImpact] = useState<(typeof IMPACTS)[number]>('low');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateWorkout({
        goal,
        level,
        durationMinutes: duration,
        impact,
      });
      // Store generated plan temporarily and go to a dynamic preview
      sessionStorage.setItem('fittv_generated_plan', JSON.stringify(res.workout));
      navigate('/preview/generated');
    } catch (err: any) {
      // Fallback to curated
      const curated = getAllCurated();
      const match =
        curated.find(
          (w) =>
            w.level === level &&
            w.impact === impact &&
            Math.abs(w.estimatedDurationMinutes - duration) <= 5
        ) || curated[0];
      setError(err?.message || 'Generation unavailable – using curated plan.');
      setTimeout(() => navigate(`/preview/${match.id}`), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Focusable as="button" className="btn btn-ghost" onSelect={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </Focusable>

      <h1>Personalize Your Workout</h1>
      <p>Tell us a few preferences. We’ll generate a structured plan.</p>

      {error && (
        <p style={{ color: 'var(--warning)', marginTop: 12 }}>{error}</p>
      )}

      <section style={{ marginTop: 32 }}>
        <h3>Goal</h3>
        <div className="row">
          {GOALS.map((g) => (
            <Focusable
              key={g}
              as="button"
              className={`btn ${goal === g ? 'btn-primary' : 'btn-ghost'}`}
              onSelect={() => setGoal(g)}
            >
              {g}
            </Focusable>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h3>Experience Level</h3>
        <div className="row">
          {LEVELS.map((l) => (
            <Focusable
              key={l}
              as="button"
              className={`btn ${level === l ? 'btn-primary' : 'btn-ghost'}`}
              onSelect={() => setLevel(l)}
            >
              {l}
            </Focusable>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h3>Duration (minutes)</h3>
        <div className="row">
          {DURATIONS.map((d) => (
            <Focusable
              key={d}
              as="button"
              className={`btn ${duration === d ? 'btn-primary' : 'btn-ghost'}`}
              onSelect={() => setDuration(d)}
            >
              {d}
            </Focusable>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h3>Impact Preference</h3>
        <div className="row">
          {IMPACTS.map((i) => (
            <Focusable
              key={i}
              as="button"
              className={`btn ${impact === i ? 'btn-primary' : 'btn-ghost'}`}
              onSelect={() => setImpact(i)}
            >
              {i}
            </Focusable>
          ))}
        </div>
      </section>

      <div className="row" style={{ marginTop: 48 }}>
        <Focusable
          as="button"
          className="btn btn-primary"
          autoFocus
          onSelect={loading ? undefined : handleGenerate}
        >
          {loading ? 'Generating…' : 'Generate Plan'}
        </Focusable>
      </div>
    </div>
  );
}

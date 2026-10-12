import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
      const res = await api.generateWorkout({ goal, level, durationMinutes: duration, impact });
      sessionStorage.setItem('fittv_generated_plan', JSON.stringify(res.workout));
      navigate('/preview/generated');
    } catch (err: unknown) {
      const curated = getAllCurated();
      const match =
        curated.find(
          (w) =>
            w.level === level &&
            w.impact === impact &&
            Math.abs(w.estimatedDurationMinutes - duration) <= 5
        ) || curated[0];
      const message =
        err instanceof Error ? err.message : 'Generation unavailable – using curated plan.';
      setError(message);
      setTimeout(() => navigate(`/preview/${match.id}`), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-pad">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <header className="page-header" style={{ marginTop: 18 }}>
        <div>
          <p className="overline">Personalize</p>
          <h1>Shape tonight’s session</h1>
          <p className="lede">We’ll build a structured plan from your preferences, with a safe fallback if needed.</p>
        </div>
      </header>

      {error && <p style={{ color: 'var(--coral)', marginBottom: 16 }}>{error}</p>}

      <section className="panel" style={{ marginBottom: 18 }}>
        <h3>Goal</h3>
        <div className="choice-row">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              className={`choice-chip ${goal === g ? 'active' : ''}`}
              onClick={() => setGoal(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginBottom: 18 }}>
        <h3>Experience level</h3>
        <div className="choice-row">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              className={`choice-chip ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginBottom: 18 }}>
        <h3>Duration (minutes)</h3>
        <div className="choice-row">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={`choice-chip ${duration === d ? 'active' : ''}`}
              onClick={() => setDuration(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginBottom: 28 }}>
        <h3>Impact preference</h3>
        <div className="choice-row">
          {IMPACTS.map((i) => (
            <button
              key={i}
              type="button"
              className={`choice-chip ${impact === i ? 'active' : ''}`}
              onClick={() => setImpact(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="button primary"
        disabled={loading}
        onClick={handleGenerate}
      >
        <Sparkles size={16} />
        {loading ? 'Generating…' : 'Generate plan'}
      </button>
    </div>
  );
}

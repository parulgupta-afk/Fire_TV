import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Clock3 } from 'lucide-react';
import { getCuratedById } from '../data/curatedWorkouts';
import { resolveDemo } from '../data/exerciseVideos';
import { Exercise } from '../types/workout';

export function PreviewScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const plan = useMemo(() => {
    if (id === 'generated') {
      try {
        const raw = sessionStorage.getItem('fittv_generated_plan');
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    return id ? getCuratedById(id) : undefined;
  }, [id]);

  if (!plan) {
    return (
      <div className="page-pad">
        <div className="empty-state">
          <h2>Workout not found</h2>
          <button type="button" className="button primary" onClick={() => navigate('/')}>
            Back home
          </button>
        </div>
      </div>
    );
  }

  const startPath = id === 'generated' ? '/player/generated' : `/player/${plan.id}`;

  return (
    <div className="page-pad">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <header className="page-header" style={{ marginTop: 18 }}>
        <div>
          <p className="overline">{plan.goal}</p>
          <h1>{plan.title}</h1>
          <p className="lede">
            {plan.level} · {plan.estimatedDurationMinutes} min · {plan.impact} impact
            {plan.source ? ` · ${plan.source}` : ''}
          </p>
          {plan.coachNotes && <p style={{ color: 'var(--muted)', maxWidth: 640 }}>{plan.coachNotes}</p>}
        </div>
        <button type="button" className="button primary" onClick={() => navigate(startPath)}>
          <Play size={16} /> Start workout
        </button>
      </header>

      <div className="section-heading">
        <div>
          <p className="overline">Session plan</p>
          <h2>Exercises</h2>
        </div>
      </div>

      <div className="plan-list">
        {plan.exercises.map((ex: Exercise, i: number) => (
          <div key={ex.id || i} className="plan-item">
            <div className="plan-index">{String(i + 1).padStart(2, '0')}</div>
            <div className="plan-body">
              <strong>{ex.name}</strong>
              <p>{ex.instructions}</p>
            </div>
            <div className="plan-meta">
              <Clock3 size={14} />
              {ex.durationSeconds ? `${ex.durationSeconds}s` : `${ex.reps} reps`}
              {ex.restSeconds ? ` + ${ex.restSeconds}s rest` : ''}
              {resolveDemo(ex.name).available ? ' · Demo video' : ' · Form guide'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

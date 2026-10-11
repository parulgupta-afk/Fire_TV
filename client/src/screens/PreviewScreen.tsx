import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCuratedById } from '../data/curatedWorkouts';
import { Focusable } from '../components/Focusable';

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
      <div className="app-shell">
        <div className="error-state">
          <h2>Workout not found</h2>
          <Focusable as="button" className="btn btn-primary" onSelect={() => navigate('/')}>
            Back Home
          </Focusable>
        </div>
      </div>
    );
  }

  const startPath =
    id === 'generated' ? '/player/generated' : `/player/${plan.id}`;

  return (
    <div className="app-shell">
      <Focusable as="button" className="btn btn-ghost" onSelect={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </Focusable>

      <h1>{plan.title}</h1>
      <p>
        {plan.goal} · {plan.level} · {plan.estimatedDurationMinutes} min · {plan.impact} impact
        {plan.source ? ` · ${plan.source}` : ''}
      </p>
      {plan.coachNotes && (
        <p style={{ fontStyle: 'italic', maxWidth: 700 }}>{plan.coachNotes}</p>
      )}

      <h2 style={{ marginTop: 32, marginBottom: 16 }}>Exercises</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
        {plan.exercises.map((ex: any, i: number) => (
          <div key={ex.id || i} className="card" style={{ padding: '16px 20px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>
                {i + 1}. {ex.name}
              </strong>
              <span style={{ color: 'var(--text-muted)' }}>
                {ex.durationSeconds ? `${ex.durationSeconds}s` : `${ex.reps} reps`}
                {ex.restSeconds ? ` + ${ex.restSeconds}s rest` : ''}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 18 }}>{ex.instructions}</p>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 40 }}>
        <Focusable
          as="button"
          className="btn btn-primary"
          autoFocus
          onSelect={() => navigate(startPath)}
        >
          Start Workout
        </Focusable>
      </div>
    </div>
  );
}

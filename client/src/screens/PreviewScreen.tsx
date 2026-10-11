import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCuratedById } from '../data/curatedWorkouts';
import { Focusable } from '../components/Focusable';

export function PreviewScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plan = id ? getCuratedById(id) : undefined;

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

  return (
    <div className="app-shell">
      <Focusable as="button" className="btn btn-ghost" onSelect={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </Focusable>

      <h1>{plan.title}</h1>
      <p>{plan.goal} · {plan.level} · {plan.estimatedDurationMinutes} min · {plan.impact} impact</p>
      {plan.coachNotes && <p style={{ fontStyle: 'italic', maxWidth: 700 }}>{plan.coachNotes}</p>}

      <h2 style={{ marginTop: 32, marginBottom: 16 }}>Exercises</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 800 }}>
        {plan.exercises.map((ex, i) => (
          <div key={ex.id} className="card" style={{ padding: '16px 20px' }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <strong>{i + 1}. {ex.name}</strong>
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
          onSelect={() => navigate(`/player/${plan.id}`)}
        >
          Start Workout
        </Focusable>
      </div>
    </div>
  );
}

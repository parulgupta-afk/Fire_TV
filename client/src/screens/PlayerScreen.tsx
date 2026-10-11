import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCuratedById } from '../data/curatedWorkouts';
import { WorkoutEngine } from '../features/workouts/workoutEngine';
import { PlayerSnapshot, CompletedWorkout } from '../types/workout';
import { Focusable } from '../components/Focusable';
import { addToHistory } from '../utils/storage';

function resolvePlan(id: string | undefined) {
  if (!id) return null;
  if (id === 'generated') {
    try {
      const raw = sessionStorage.getItem('fittv_generated_plan');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return getCuratedById(id) || null;
}

export function PlayerScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plan = resolvePlan(id);
  const engineRef = useRef<WorkoutEngine | null>(null);
  const [snapshot, setSnapshot] = useState<PlayerSnapshot | null>(null);
  const [showAdapt, setShowAdapt] = useState(false);

  useEffect(() => {
    if (!plan) return;
    const engine = new WorkoutEngine(plan);
    engineRef.current = engine;

    engine.subscribe(
      (s) => setSnapshot(s),
      (record: CompletedWorkout) => {
        addToHistory(record);
        navigate('/feedback', { state: { record } });
      }
    );

    const t = setTimeout(() => engine.start(), 400);
    return () => {
      clearTimeout(t);
      engine.destroy();
    };
  }, [plan, navigate]);

  if (!plan) {
    return (
      <div className="app-shell">
        <div className="error-state">
          <h2>Workout not found</h2>
          <Focusable as="button" className="btn btn-primary" onSelect={() => navigate('/')}>
            Home
          </Focusable>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="app-shell">
        <div className="loading-state">Preparing your session…</div>
      </div>
    );
  }

  const current = engineRef.current?.getCurrentExercise();
  const next = engineRef.current?.getNextExercise();
  const progressPct =
    plan.exercises.length > 0
      ? Math.round((snapshot.completedExerciseIds.length / plan.exercises.length) * 100)
      : 0;

  const isPaused = snapshot.state === 'paused';
  const isResting = snapshot.isResting;

  return (
    <div className="app-shell player-screen">
      <div>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'var(--text-muted)' }}>{plan.title}</span>
          <span style={{ color: 'var(--text-muted)' }}>
            {snapshot.completedExerciseIds.length + 1} / {plan.exercises.length}
          </span>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isResting ? (
          <>
            <div className="exercise-name">Rest</div>
            <p className="instructions">Catch your breath. Next up: {next?.name ?? 'Finish'}</p>
          </>
        ) : (
          <>
            <div className="exercise-name">{current?.name ?? 'Done'}</div>
            <p className="instructions">{current?.instructions}</p>
          </>
        )}

        <div className="timer-display">
          {String(Math.floor(snapshot.secondsRemaining / 60)).padStart(1, '0')}:
          {String(snapshot.secondsRemaining % 60).padStart(2, '0')}
        </div>

        {isPaused && (
          <p style={{ textAlign: 'center', color: 'var(--warning)', fontSize: 28 }}>PAUSED</p>
        )}
      </div>

      <div className="controls">
        {isPaused ? (
          <Focusable as="button" className="btn btn-primary" autoFocus onSelect={() => engineRef.current?.resume()}>
            Resume
          </Focusable>
        ) : (
          <Focusable as="button" className="btn btn-ghost" onSelect={() => engineRef.current?.pause()}>
            Pause
          </Focusable>
        )}

        <Focusable as="button" className="btn btn-ghost" onSelect={() => engineRef.current?.skip()}>
          Skip
        </Focusable>

        <Focusable as="button" className="btn btn-ghost" onSelect={() => setShowAdapt((v) => !v)}>
          Adapt
        </Focusable>

        <Focusable as="button" className="btn btn-danger" onSelect={() => engineRef.current?.stop()}>
          End
        </Focusable>
      </div>

      {showAdapt && (
        <div className="row" style={{ justifyContent: 'center', marginTop: 16, gap: 12 }}>
          <Focusable
            as="button"
            className="btn btn-accent"
            onSelect={() => {
              engineRef.current?.adapt({ shorter: true });
              setShowAdapt(false);
            }}
          >
            Make Shorter
          </Focusable>
          <Focusable
            as="button"
            className="btn btn-accent"
            onSelect={() => {
              engineRef.current?.adapt({ easier: true, noJumping: true });
              setShowAdapt(false);
            }}
          >
            Make Easier / No Jumping
          </Focusable>
        </div>
      )}
    </div>
  );
}

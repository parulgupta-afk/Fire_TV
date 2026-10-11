import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pause, Play, SkipForward, X, WandSparkles } from 'lucide-react';
import { getCuratedById } from '../data/curatedWorkouts';
import { WorkoutEngine } from '../features/workouts/workoutEngine';
import { PlayerSnapshot, CompletedWorkout } from '../types/workout';
import { addToHistory } from '../utils/storage';
import { resolveDemo } from '../data/exerciseVideos';
import { ExerciseDemoPanel } from '../components/ExerciseDemoPanel';

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
      <div className="session-shell">
        <div className="empty-state">
          <h2>Workout not found</h2>
          <button type="button" className="button primary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="session-shell">
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
  const mm = String(Math.floor(snapshot.secondsRemaining / 60)).padStart(1, '0');
  const ss = String(snapshot.secondsRemaining % 60).padStart(2, '0');

  const demo = resolveDemo(isResting ? next?.name : current?.name);

  return (
    <div className="session-shell session-with-demo">
      <div className="session-top">
        <div>
          <p className="overline">{plan.title}</p>
          <span className="session-count">
            {Math.min(snapshot.completedExerciseIds.length + 1, plan.exercises.length)} /{' '}
            {plan.exercises.length}
          </span>
        </div>
        <button type="button" className="button ghost" onClick={() => engineRef.current?.stop()}>
          <X size={16} /> End
        </button>
      </div>

      <div className="session-progress">
        <div style={{ width: `${progressPct}%` }} />
      </div>

      <div className="session-layout">
        <ExerciseDemoPanel demo={demo} isResting={isResting} />

        <div className="session-stage">
          {isResting ? (
            <>
              <p className="overline">Rest</p>
              <h1>Breathe</h1>
              <p className="session-cue">Next up: {next?.name ?? 'Finish'}</p>
            </>
          ) : (
            <>
              <p className="overline">Now</p>
              <h1>{current?.name ?? 'Done'}</h1>
              <p className="session-cue">{current?.instructions}</p>
            </>
          )}

          <div className="session-timer">
            {mm}:{ss}
          </div>
          {isPaused && <p className="session-paused">PAUSED</p>}
          <p className="session-safety">
            Move within comfortable limits. Stop if you feel pain, dizziness, or unwell.
          </p>
        </div>
      </div>

      <div className="session-controls">
        {isPaused ? (
          <button type="button" className="button primary" onClick={() => engineRef.current?.resume()}>
            <Play size={18} /> Resume
          </button>
        ) : (
          <button type="button" className="button secondary" onClick={() => engineRef.current?.pause()}>
            <Pause size={18} /> Pause
          </button>
        )}
        <button type="button" className="button secondary" onClick={() => engineRef.current?.skip()}>
          <SkipForward size={18} /> Skip
        </button>
        <button type="button" className="button secondary" onClick={() => setShowAdapt((v) => !v)}>
          <WandSparkles size={18} /> Adapt
        </button>
      </div>

      {showAdapt && (
        <div className="adjust-overlay">
          <div className="adjust-card">
            <div className="adjust-options">
              <button
                type="button"
                className="button primary full"
                onClick={() => {
                  engineRef.current?.adapt({ shorter: true });
                  setShowAdapt(false);
                }}
              >
                Make shorter
              </button>
              <button
                type="button"
                className="button secondary full"
                onClick={() => {
                  engineRef.current?.adapt({ easier: true, noJumping: true });
                  setShowAdapt(false);
                }}
              >
                Make easier / no jumping
              </button>
              <button type="button" className="button ghost full" onClick={() => setShowAdapt(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

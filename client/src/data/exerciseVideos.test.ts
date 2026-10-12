import { describe, it, expect } from 'vitest';
import {
  getExerciseDemo,
  resolveDemo,
  youtubeEmbedSrc,
  listDemoCatalogue,
} from './exerciseVideos';
import {
  fedbImageUrl,
  listLocalMediaPaths,
  resolveExerciseMedia,
} from '../services/exerciseMedia';
import { getAllCurated } from './curatedWorkouts';

describe('exercise media catalogue', () => {
  it('maps bodyweight squats to bundled two-frame photos', () => {
    const demo = getExerciseDemo('Bodyweight Squats');
    expect(demo).not.toBeNull();
    expect(demo!.imageUrl).toContain('bodyweight-squats');
    expect(demo!.frames).toHaveLength(2);
    expect(demo!.available).toBe(true);
  });

  it('maps march in place to its animated local guide', () => {
    const demo = getExerciseDemo('March in Place');
    expect(demo).not.toBeNull();
    expect(demo!.imageUrl).toBe('/exercises/march-in-place.svg');
    expect(demo!.available).toBe(true);
  });

  it('glute bridge uses the bridge photo frames', () => {
    const demo = getExerciseDemo('Glute Bridge');
    expect(demo!.imageUrl).toContain('glute-bridge');
  });

  it('does not reuse a mismatched photo for movements it does not show', () => {
    // These used to point at a barbell squat, a bench step-up and a full push-up.
    for (const name of ['Chair Squats', 'Standing Knee Raises', 'Knee Push-ups', 'Wall Push-ups', 'Bird Dog']) {
      const demo = getExerciseDemo(name)!;
      expect(demo.imageUrl).toMatch(/^\/exercises\/[a-z-]+\.svg$/);
      expect(demo.frames).toBeUndefined();
    }
  });

  it('is case-insensitive', () => {
    const a = getExerciseDemo('bodyweight squats');
    const b = getExerciseDemo('Bodyweight Squats');
    expect(a?.key).toBe(b?.key);
  });

  it('matches curly and straight apostrophes', () => {
    const curly = getExerciseDemo('Child’s Pose Stretch');
    const straight = getExerciseDemo("Child's Pose Stretch");
    expect(curly).not.toBeNull();
    expect(curly!.imageUrl).toContain('childs-pose');
    expect(curly!.key).toBe(straight!.key);
  });

  it('resolveDemo always returns usable fallback', () => {
    const d = resolveDemo('Unknown Move 99');
    expect(d.fallbackInstructions.length).toBeGreaterThan(10);
  });

  it('fedbImageUrl builds correct prefix', () => {
    expect(fedbImageUrl('Plank/0.jpg')).toContain('free-exercise-db/main/exercises/Plank/0.jpg');
  });

  it('youtubeEmbedSrc encodes id only', () => {
    expect(youtubeEmbedSrc('abc123')).toContain('embed/abc123');
  });

  it('every catalogue entry has a visual', () => {
    const all = listDemoCatalogue();
    const withVisual = all.filter((d) => d.imageUrl || d.gifUrl || d.youtubeVideoId);
    expect(withVisual.length).toBe(all.length);
  });

  it('every exercise in the curated workouts resolves to a demo', () => {
    for (const workout of getAllCurated()) {
      for (const ex of workout.exercises) {
        const demo = getExerciseDemo(ex.name);
        expect(demo, `${workout.id}: ${ex.name}`).not.toBeNull();
        expect(demo!.available, `${workout.id}: ${ex.name}`).toBe(true);
      }
    }
  });

  it('keeps YouTube playable alongside a photo or guide', () => {
    const demo = getExerciseDemo('Bodyweight Squats')!;
    expect(demo.provider).toBe('image');
    expect(demo.youtubeVideoId).toBeTruthy();
  });

  it('every bundled media file exists in public/', () => {
    const files = Object.keys(import.meta.glob('../../public/exercises/**/*'));
    for (const p of listLocalMediaPaths()) {
      expect(files, p).toContain(`../../public${p}`);
    }
  });

  it('resolveExerciseMedia has no remote GIF dependency by default', () => {
    const m = resolveExerciseMedia({ name: 'Bodyweight Squats' });
    expect(m.gifUrl).toBeUndefined();
    expect(m.frames).toHaveLength(2);
  });
});

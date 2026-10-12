import { describe, it, expect } from 'vitest';
import {
  getExerciseDemo,
  resolveDemo,
  youtubeEmbedSrc,
  listDemoCatalogue,
} from './exerciseVideos';
import { fedbImageUrl, resolveExerciseMedia } from '../services/exerciseMedia';

describe('exercise media catalogue', () => {
  it('maps bodyweight squats to free-exercise-db image', () => {
    const demo = getExerciseDemo('Bodyweight Squats');
    expect(demo).not.toBeNull();
    expect(demo!.imageUrl).toContain('Bodyweight_Squat');
    expect(demo!.available).toBe(true);
  });

  it('maps march in place to local guide', () => {
    const demo = getExerciseDemo('March in Place');
    expect(demo).not.toBeNull();
    expect(demo!.imageUrl).toBe('/exercises/march-in-place.svg');
    expect(demo!.available).toBe(true);
  });

  it('glute bridge uses butt lift bridge photo', () => {
    const demo = getExerciseDemo('Glute Bridge');
    expect(demo!.imageUrl).toContain('Butt_Lift_Bridge');
  });

  it('is case-insensitive', () => {
    const a = getExerciseDemo('bodyweight squats');
    const b = getExerciseDemo('Bodyweight Squats');
    expect(a?.key).toBe(b?.key);
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

  it('every catalogue entry has some visual or stays honest', () => {
    const all = listDemoCatalogue();
    const withVisual = all.filter((d) => d.imageUrl || d.gifUrl || d.youtubeVideoId);
    // Most should have a visual now
    expect(withVisual.length).toBeGreaterThanOrEqual(18);
  });

  it('resolveExerciseMedia prefers gif when mapped', () => {
    const m = resolveExerciseMedia({ name: 'Bodyweight Squats' });
    expect(m.gifUrl).toContain('static.exercisedb.dev');
  });
});

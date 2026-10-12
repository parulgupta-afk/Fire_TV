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
    expect(demo!.imageUrl).toContain('raw.githubusercontent.com/yuhonas/free-exercise-db');
    expect(demo!.available).toBe(true);
  });

  it('is case-insensitive', () => {
    const a = getExerciseDemo('bodyweight squats');
    const b = getExerciseDemo('Bodyweight Squats');
    expect(a?.key).toBe(b?.key);
    expect(a?.imageUrl).toBe(b?.imageUrl);
  });

  it('returns null for unknown name via getExerciseDemo', () => {
    expect(getExerciseDemo('Totally Fake Exercise XYZ')).toBeNull();
  });

  it('resolveDemo always returns usable fallback', () => {
    const d = resolveDemo('Unknown Move 99');
    expect(d.fallbackInstructions.length).toBeGreaterThan(10);
    expect(d.formCues.length).toBeGreaterThan(0);
  });

  it('fedbImageUrl builds correct prefix', () => {
    expect(fedbImageUrl('Plank/0.jpg')).toBe(
      'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg'
    );
  });

  it('youtubeEmbedSrc encodes id only', () => {
    const src = youtubeEmbedSrc('abc123');
    expect(src).toContain('youtube-nocookie.com/embed/abc123');
  });

  it('catalogue has media for priority exercises', () => {
    const names = listDemoCatalogue().filter((d) => d.imageUrl || d.gifUrl).map((d) => d.name);
    expect(names).toEqual(expect.arrayContaining(['Bodyweight Squats', 'Chair Squats', 'Dead Bug (Modified)']));
  });

  it('resolveExerciseMedia prefers gif when mapped', () => {
    const m = resolveExerciseMedia({ name: 'Bodyweight Squats' });
    expect(m.gifUrl).toContain('static.exercisedb.dev');
    expect(m.imageUrl).toContain('Bodyweight_Squat');
  });
});

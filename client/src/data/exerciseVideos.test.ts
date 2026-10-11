import { describe, it, expect } from 'vitest';
import {
  getExerciseDemo,
  resolveDemo,
  youtubeEmbedSrc,
  listDemoCatalogue,
} from './exerciseVideos';

describe('exercise video catalogue', () => {
  it('maps known exercise by name', () => {
    const demo = getExerciseDemo('Bodyweight Squats');
    expect(demo).not.toBeNull();
    expect(demo!.name).toBe('Bodyweight Squats');
    expect(demo!.formCues.length).toBeGreaterThan(0);
  });

  it('is case-insensitive', () => {
    const a = getExerciseDemo('march in place');
    const b = getExerciseDemo('March in Place');
    expect(a?.key).toBe(b?.key);
  });

  it('returns null for unknown id/name', () => {
    expect(getExerciseDemo('Totally Fake Exercise XYZ')).toBeNull();
  });

  it('resolveDemo always returns usable fallback', () => {
    const d = resolveDemo('Unknown Move 99');
    expect(d.available).toBe(false);
    expect(d.fallbackInstructions.length).toBeGreaterThan(10);
    expect(d.formCues.length).toBeGreaterThan(0);
  });

  it('does not invent available videos without ids', () => {
    const all = listDemoCatalogue();
    for (const d of all) {
      if (d.available) {
        expect(
          (d.provider === 'youtube' && d.youtubeVideoId) ||
            (d.provider === 'self_hosted' && d.videoUrl)
        ).toBeTruthy();
      } else {
        expect(d.provider).toBe('none');
      }
    }
  });

  it('youtubeEmbedSrc encodes id only', () => {
    const src = youtubeEmbedSrc('abc123');
    expect(src).toContain('youtube-nocookie.com/embed/abc123');
    expect(src).not.toContain('undefined');
  });
});

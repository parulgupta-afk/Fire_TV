/**
 * Exercise demonstration catalogue.
 *
 * Media resolution:
 * - Photos: yuhonas/free-exercise-db (public domain), bundled locally, via exerciseMedia.ts
 * - Animated guides: local looping SVGs drawn for the exact movement
 * - GIFs: optional oss.exercisedb.dev free tier (attribution required)
 * - YouTube: optional "Play video" embeds (ids checked against the exercise title)
 *
 * Timer does NOT depend on media load/playback.
 */

import {
  resolveExerciseMedia,
  type ResolvedMedia,
} from '../services/exerciseMedia';

export type VideoProvider = 'none' | 'youtube' | 'self_hosted' | 'image' | 'gif';

export interface ExerciseDemo {
  key: string;
  name: string;
  available: boolean;
  provider: VideoProvider;
  youtubeVideoId?: string;
  videoUrl?: string;
  /** Still image, or animated local SVG guide */
  imageUrl?: string;
  /** Start/end photo frames; the panel cross-fades them like a short loop */
  frames?: string[];
  /** Animated GIF when available */
  gifUrl?: string;
  description: string;
  formCues: string[];
  fallbackInstructions: string;
  attribution?: string;
  licenseNote?: string;
}

function norm(name: string): string {
  // Curly apostrophes (e.g. "Child’s Pose Stretch") must match the catalogue key
  return name.trim().toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ');
}

type CatalogEntry = {
  name: string;
  description: string;
  formCues: string[];
  fallbackInstructions: string;
  youtubeVideoId?: string;
};

/** Canonical cues + optional YouTube ids for FitTV exercises */
const CATALOG: CatalogEntry[] = [
  {
    name: 'Bodyweight Squats',
    description: 'Bodyweight squat for legs and glutes.',
    formCues: ['Feet about shoulder-width', 'Sit hips back', 'Chest lifted', 'Knees track over toes'],
    fallbackInstructions:
      'Stand with feet shoulder-width. Sit hips back and down, keep chest up, stand through the feet.',
    youtubeVideoId: 'l83R5PblSMA',
  },
  {
    name: 'Glute Bridge',
    description: 'Hip extension on the floor.',
    formCues: ['Knees bent, feet flat', 'Lift hips, squeeze glutes', 'Lower with control'],
    fallbackInstructions:
      'Lie on your back, knees bent. Lift hips toward the ceiling, squeeze glutes, lower slowly.',
    youtubeVideoId: 'tqp5XQPpTxY',
  },
  {
    name: 'Bird Dog',
    description: 'Opposite arm and leg reach for stability.',
    formCues: ['Hands under shoulders', 'Extend opposite arm and leg', 'Keep hips level'],
    fallbackInstructions:
      'On all fours, extend one arm and the opposite leg. Hold briefly, switch sides.',
    youtubeVideoId: 'kGPVyMPpEQo',
  },
  {
    name: 'Chair Squats',
    description: 'Squat to a chair for support.',
    formCues: ['Chair behind you', 'Sit back to light touch', 'Stand without momentum'],
    fallbackInstructions:
      'Stand in front of a stable chair. Sit back until you lightly touch the seat, then stand.',
    youtubeVideoId: 'mZhcnuXF3Ww',
  },
  {
    name: 'Wall Push-ups',
    description: 'Upper-body push with reduced load.',
    formCues: ['Hands at shoulder height', 'Body in a line', 'Lower and push away'],
    fallbackInstructions:
      'Hands on wall at shoulder height. Lower chest toward wall, push away. Keep body roughly straight.',
    youtubeVideoId: 'b01muAD0_NI',
  },
  {
    name: 'Reverse Lunges (gentle)',
    description: 'Step-back lunge with control.',
    formCues: ['Step one foot back', 'Lower until comfortable', 'Front knee tracks forward'],
    fallbackInstructions:
      'Step one foot back and lower until comfortable. Alternate sides. Hold support if needed.',
  },
  {
    name: 'Dead Bug (Modified)',
    description: 'Supine core control.',
    formCues: ['On back, knees bent', 'Extend opposite arm and leg', 'Keep lower back comfortable'],
    fallbackInstructions:
      'Lie on your back. Slowly extend one arm and the opposite leg, then return. Alternate.',
    youtubeVideoId: 'YwxJwe4bBTo',
  },
  {
    name: 'March in Place',
    description: 'Gentle marching warm-up.',
    formCues: ['Stand tall', 'Lift knees comfortably', 'Swing arms naturally'],
    fallbackInstructions: 'Stand tall and march in place at a steady rhythm. Stop if dizzy or unwell.',
  },
  {
    name: 'Standing Knee Raises',
    description: 'Standing knee raise.',
    formCues: ['Hold support if needed', 'Lift knee toward chest', 'Alternate sides'],
    fallbackInstructions: 'Stand tall. Lift one knee toward your chest, pause, lower. Alternate.',
  },
  {
    name: 'Cool Down Stretch',
    description: 'Easy stretch and breathing.',
    formCues: ['Reach overhead', 'Gentle fold if comfortable', 'Breathe slowly'],
    fallbackInstructions: 'Reach arms overhead, then gently fold forward if comfortable. Breathe deeply.',
  },
  {
    name: 'Side Steps',
    description: 'Lateral stepping.',
    formCues: ['Step side to side', 'Soft knees', 'Upright posture'],
    fallbackInstructions: 'Step side to side at a comfortable pace with soft knees.',
  },
  {
    name: 'Arm Circles + March',
    description: 'Arm circles with light march.',
    formCues: ['Small arm circles', 'Light march', 'Reverse direction halfway'],
    fallbackInstructions: 'March gently while making small arm circles. Reverse direction halfway.',
  },
  {
    name: 'Step Touches',
    description: 'Side step and touch.',
    formCues: ['Step out', 'Touch other foot in', 'Alternate'],
    fallbackInstructions: 'Step one foot out, bring the other to touch. Alternate sides.',
  },
  {
    name: 'Gentle Step Jacks',
    description: 'Low-impact step-jack pattern.',
    formCues: ['Step one foot out', 'Raise arms', 'No jumping required'],
    fallbackInstructions: 'Step one foot out while raising arms, then return. No jumping required.',
  },
  {
    name: 'Gentle Jumping Jacks (or Step Jacks)',
    description: 'Step-jack variation.',
    formCues: ['Prefer step-jacks', 'Raise arms with step-out'],
    fallbackInstructions: 'Prefer step-jacks over jumps. Alternate sides.',
  },
  {
    name: 'Cool Down Walk',
    description: 'Slow march cooldown.',
    formCues: ['Slow march', 'Deep breaths'],
    fallbackInstructions: 'Slow march in place and breathe deeply.',
  },
  {
    name: 'Pelvic Tilts',
    description: 'Small pelvic mobility.',
    formCues: ['On back, knees bent', 'Gently flatten lower back', 'Release'],
    fallbackInstructions: 'Lie on your back. Gently tilt the pelvis to flatten the lower back, then release.',
  },
  {
    name: 'Side-Lying Leg Lifts',
    description: 'Side-lying leg lift.',
    formCues: ['Lie on side', 'Lift top leg controlled', 'Switch sides halfway'],
    fallbackInstructions: 'Lie on one side. Lift the top leg slowly, lower. Switch sides halfway.',
  },
  {
    name: "Child's Pose Stretch",
    description: 'Kneeling rest stretch.',
    formCues: ['Kneel and fold forward', 'Breathe into the back'],
    fallbackInstructions: 'Kneel and fold forward. Rest and breathe. Use a seated fold if needed.',
  },
  {
    name: 'Seated March',
    description: 'Seated knee lifts.',
    formCues: ['Sit tall', 'Lift knees alternately'],
    fallbackInstructions: 'Sit tall. Lift one knee at a time in a marching pattern.',
  },
  {
    name: 'Standing Hip Extensions',
    description: 'Standing hip extension.',
    formCues: ['Hold support if needed', 'Reach leg back', 'Upright torso'],
    fallbackInstructions: 'Stand tall. Reach one leg straight back without arching the lower back.',
  },
  {
    name: 'Box Breathing',
    description: 'Equal breath counts.',
    formCues: ['Inhale 4', 'Hold 4', 'Exhale 4', 'Hold 4'],
    fallbackInstructions: 'Inhale, hold, exhale, hold for equal counts. Stop if lightheaded.',
  },
  {
    name: 'Knee Push-ups',
    description: 'Push-up from knees.',
    formCues: ['Hands under shoulders', 'Knees on floor', 'Lower and press'],
    fallbackInstructions:
      'From knees, lower chest and press up. Keep a straight line from knees to head.',
  },
];

const BY_KEY = new Map(CATALOG.map((c) => [norm(c.name), c]));

function toDemo(entry: CatalogEntry, media: ResolvedMedia): ExerciseDemo {
  const hasImage = !!media.imageUrl;
  const hasGif = !!media.gifUrl;
  const hasYt = !!media.youtubeVideoId;

  let provider: VideoProvider = 'none';
  if (hasGif) provider = 'gif';
  else if (hasImage) provider = 'image';
  else if (hasYt) provider = 'youtube';

  return {
    key: media.key,
    name: entry.name,
    available: hasImage || hasGif || hasYt,
    provider,
    youtubeVideoId: media.youtubeVideoId,
    imageUrl: media.imageUrl,
    frames: media.frames,
    gifUrl: media.gifUrl,
    description: entry.description,
    formCues: entry.formCues,
    fallbackInstructions: entry.fallbackInstructions,
    attribution: media.attribution.join(' · ') || undefined,
    licenseNote: hasGif
      ? 'GIF: ExerciseDB free tier — credit AscendAPI; non-commercial'
      : hasImage
        ? media.frames
          ? 'Photos: free-exercise-db (Unlicense / public domain)'
          : 'Animated guide: FitTV AI'
        : hasYt
          ? 'YouTube embed — subject to YouTube Terms of Service'
          : undefined,
  };
}

export function getExerciseDemo(exerciseName: string | undefined | null): ExerciseDemo | null {
  if (!exerciseName) return null;
  const entry = BY_KEY.get(norm(exerciseName));
  if (!entry) return null;
  const media = resolveExerciseMedia({
    name: entry.name,
    formCues: entry.formCues,
    fallbackInstructions: entry.fallbackInstructions,
    youtubeVideoId: entry.youtubeVideoId,
    availableYoutube: !!entry.youtubeVideoId,
  });
  return toDemo(entry, media);
}

export function getGenericDemo(exerciseName: string): ExerciseDemo {
  const media = resolveExerciseMedia({ name: exerciseName });
  return {
    key: media.key,
    name: exerciseName,
    available: false,
    provider: 'none',
    description: 'Follow the written instructions for this movement.',
    formCues: media.formCues,
    fallbackInstructions: media.instructions,
  };
}

export function resolveDemo(exerciseName: string | undefined | null): ExerciseDemo {
  return getExerciseDemo(exerciseName) ?? getGenericDemo(exerciseName || 'Exercise');
}

export function youtubeEmbedSrc(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });
  if (autoplay) params.set('autoplay', '1');
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}

export function listDemoCatalogue(): ExerciseDemo[] {
  return CATALOG.map((entry) => {
    const media = resolveExerciseMedia({
      name: entry.name,
      formCues: entry.formCues,
      fallbackInstructions: entry.fallbackInstructions,
      youtubeVideoId: entry.youtubeVideoId,
      availableYoutube: !!entry.youtubeVideoId,
    });
    return toDemo(entry, media);
  });
}

export function listAvailableVideoExercises(): string[] {
  return listDemoCatalogue()
    .filter((d) => d.available)
    .map((d) => d.name);
}

/**
 * Exercise demonstration catalogue — maps exercise names to demos.
 *
 * Video sources below are public YouTube educational demos (channel titles
 * noted in attribution). Standard YouTube embed is used; embedding may be
 * restricted by platform/region. Timer does NOT depend on video playback.
 *
 * Verification note: IDs were taken from public search results for
 * exercise-specific form videos (CDC, Cincinnati Children's, PureGym,
 * PartnerMD, Well+Good, Pike Fitness). Playback on Fire TV / Vega was
 * NOT tested in this environment.
 */

export type VideoProvider = 'none' | 'youtube' | 'self_hosted';

export interface ExerciseDemo {
  key: string;
  name: string;
  available: boolean;
  provider: VideoProvider;
  youtubeVideoId?: string;
  videoUrl?: string;
  description: string;
  formCues: string[];
  fallbackInstructions: string;
  attribution?: string;
  licenseNote?: string;
}

function norm(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

const DEMOS: ExerciseDemo[] = [
  {
    key: norm('Bodyweight Squats'),
    name: 'Bodyweight Squats',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'l83R5PblSMA',
    description: 'Bodyweight squat form demonstration.',
    formCues: ['Feet about shoulder-width', 'Sit hips back', 'Chest lifted', 'Knees track over toes'],
    fallbackInstructions: 'Stand with feet shoulder-width. Sit hips back and down, keep chest up, stand through the feet.',
    attribution: 'PureGym — Leg exercise - How to bodyweight squat',
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Glute Bridge'),
    name: 'Glute Bridge',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'tqp5XQPpTxY',
    description: 'Glute bridge form demonstration.',
    formCues: ['Knees bent, feet flat', 'Lift hips, squeeze glutes', 'Lower with control'],
    fallbackInstructions: 'Lie on your back, knees bent. Lift hips toward the ceiling, squeeze glutes, lower slowly.',
    attribution: 'PureGym — How To Do A Glute Bridge',
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Bird Dog'),
    name: 'Bird Dog',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'kGPVyMPpEQo',
    description: 'Bird dog stability demonstration (educational).',
    formCues: ['Hands under shoulders', 'Extend opposite arm and leg', 'Keep hips level'],
    fallbackInstructions: 'On all fours, extend one arm and the opposite leg. Hold briefly, switch sides.',
    attribution: "Cincinnati Children's — HealthWorks! Bird Dog",
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Chair Squats'),
    name: 'Chair Squats',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'mZhcnuXF3Ww',
    description: 'Chair squat demonstration.',
    formCues: ['Chair behind you', 'Sit back to light touch', 'Stand without momentum'],
    fallbackInstructions: 'Stand in front of a stable chair. Sit back until you lightly touch the seat, then stand.',
    attribution: 'Pike Fitness — Chair Squat',
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Wall Push-ups'),
    name: 'Wall Push-ups',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'b01muAD0_NI',
    description: 'Wall push-up form demonstration.',
    formCues: ['Hands at shoulder height', 'Body in a line', 'Lower and push away'],
    fallbackInstructions: 'Hands on wall at shoulder height. Lower chest toward wall, push away. Keep body roughly straight.',
    attribution: 'Brian Syuki — How to Do Wall Push Ups Correctly',
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Reverse Lunges (gentle)'),
    name: 'Reverse Lunges (gentle)',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'QAseZL_2E20',
    description: 'Reverse lunge to knee raise (educational progression).',
    formCues: ['Step one foot back', 'Lower until comfortable', 'Front knee tracks forward'],
    fallbackInstructions: 'Step one foot back and lower until comfortable. Alternate sides. Hold support if needed.',
    attribution: "Cincinnati Children's — Reverse Lunge to a Knee Raise",
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('Dead Bug (Modified)'),
    name: 'Dead Bug (Modified)',
    available: true,
    provider: 'youtube',
    youtubeVideoId: 'YwxJwe4bBTo',
    description: 'Dead bug core exercise explanation.',
    formCues: ['On back, knees bent', 'Extend opposite arm and leg', 'Keep lower back comfortable'],
    fallbackInstructions: 'Lie on your back. Slowly extend one arm and the opposite leg, then return. Alternate.',
    attribution: 'Keren Zumba — DEADBUG Core Exercise explained',
    licenseNote: 'YouTube embed; subject to YouTube Terms of Service',
  },
  {
    key: norm('March in Place'),
    name: 'March in Place',
    available: false,
    provider: 'none',
    description: 'Gentle marching warm-up.',
    formCues: ['Stand tall', 'Lift knees comfortably', 'Swing arms naturally'],
    fallbackInstructions: 'Stand tall and march in place at a steady rhythm. Stop if dizzy or unwell.',
  },
  {
    key: norm('Standing Knee Raises'),
    name: 'Standing Knee Raises',
    available: false,
    provider: 'none',
    description: 'Standing knee raise.',
    formCues: ['Hold support if needed', 'Lift knee toward chest', 'Alternate sides'],
    fallbackInstructions: 'Stand tall. Lift one knee toward your chest, pause, lower. Alternate.',
  },
  {
    key: norm('Cool Down Stretch'),
    name: 'Cool Down Stretch',
    available: false,
    provider: 'none',
    description: 'Easy stretch and breathing.',
    formCues: ['Reach overhead', 'Gentle fold if comfortable', 'Breathe slowly'],
    fallbackInstructions: 'Reach arms overhead, then gently fold forward if comfortable. Breathe deeply.',
  },
  {
    key: norm('Side Steps'),
    name: 'Side Steps',
    available: false,
    provider: 'none',
    description: 'Lateral stepping.',
    formCues: ['Step side to side', 'Soft knees', 'Upright posture'],
    fallbackInstructions: 'Step side to side at a comfortable pace with soft knees.',
  },
  {
    key: norm('Arm Circles + March'),
    name: 'Arm Circles + March',
    available: false,
    provider: 'none',
    description: 'Arm circles with light march.',
    formCues: ['Small arm circles', 'Light march', 'Reverse direction halfway'],
    fallbackInstructions: 'March gently while making small arm circles. Reverse direction halfway.',
  },
  {
    key: norm('Step Touches'),
    name: 'Step Touches',
    available: false,
    provider: 'none',
    description: 'Side step and touch.',
    formCues: ['Step out', 'Touch other foot in', 'Alternate'],
    fallbackInstructions: 'Step one foot out, bring the other to touch. Alternate sides.',
  },
  {
    key: norm('Gentle Step Jacks'),
    name: 'Gentle Step Jacks',
    available: false,
    provider: 'none',
    description: 'Low-impact step-jack pattern.',
    formCues: ['Step one foot out', 'Raise arms', 'No jumping required'],
    fallbackInstructions: 'Step one foot out while raising arms, then return. No jumping required.',
  },
  {
    key: norm('Gentle Jumping Jacks (or Step Jacks)'),
    name: 'Gentle Jumping Jacks (or Step Jacks)',
    available: false,
    provider: 'none',
    description: 'Step-jack variation.',
    formCues: ['Prefer step-jacks', 'Raise arms with step-out'],
    fallbackInstructions: 'Prefer step-jacks over jumps. Alternate sides.',
  },
  {
    key: norm('Cool Down Walk'),
    name: 'Cool Down Walk',
    available: false,
    provider: 'none',
    description: 'Slow march cooldown.',
    formCues: ['Slow march', 'Deep breaths'],
    fallbackInstructions: 'Slow march in place and breathe deeply.',
  },
  {
    key: norm('Pelvic Tilts'),
    name: 'Pelvic Tilts',
    available: false,
    provider: 'none',
    description: 'Small pelvic mobility.',
    formCues: ['On back, knees bent', 'Gently flatten lower back', 'Release'],
    fallbackInstructions: 'Lie on your back. Gently tilt the pelvis to flatten the lower back, then release.',
  },
  {
    key: norm('Side-Lying Leg Lifts'),
    name: 'Side-Lying Leg Lifts',
    available: false,
    provider: 'none',
    description: 'Side-lying leg lift.',
    formCues: ['Lie on side', 'Lift top leg controlled', 'Switch sides halfway'],
    fallbackInstructions: 'Lie on one side. Lift the top leg slowly, lower. Switch sides halfway.',
  },
  {
    key: norm("Child's Pose Stretch"),
    name: "Child's Pose Stretch",
    available: false,
    provider: 'none',
    description: 'Kneeling rest stretch.',
    formCues: ['Kneel and fold forward', 'Breathe into the back'],
    fallbackInstructions: 'Kneel and fold forward. Rest and breathe. Use a seated fold if needed.',
  },
  {
    key: norm('Seated March'),
    name: 'Seated March',
    available: false,
    provider: 'none',
    description: 'Seated knee lifts.',
    formCues: ['Sit tall', 'Lift knees alternately'],
    fallbackInstructions: 'Sit tall. Lift one knee at a time in a marching pattern.',
  },
  {
    key: norm('Standing Hip Extensions'),
    name: 'Standing Hip Extensions',
    available: false,
    provider: 'none',
    description: 'Standing hip extension.',
    formCues: ['Hold support if needed', 'Reach leg back', 'Upright torso'],
    fallbackInstructions: 'Stand tall. Reach one leg straight back without arching the lower back.',
  },
  {
    key: norm('Box Breathing'),
    name: 'Box Breathing',
    available: false,
    provider: 'none',
    description: 'Equal breath counts.',
    formCues: ['Inhale 4', 'Hold 4', 'Exhale 4', 'Hold 4'],
    fallbackInstructions: 'Inhale, hold, exhale, hold for equal counts. Stop if lightheaded.',
  },
  {
    key: norm('Knee Push-ups'),
    name: 'Knee Push-ups',
    available: false,
    provider: 'none',
    description: 'Push-up from knees.',
    formCues: ['Hands under shoulders', 'Knees on floor', 'Lower and press'],
    fallbackInstructions: 'From knees, lower chest and press up. Keep a straight line from knees to head.',
  },
];

const BY_KEY = new Map(DEMOS.map((d) => [d.key, d]));

export function getExerciseDemo(exerciseName: string | undefined | null): ExerciseDemo | null {
  if (!exerciseName) return null;
  return BY_KEY.get(norm(exerciseName)) ?? null;
}

export function getGenericDemo(exerciseName: string): ExerciseDemo {
  return {
    key: norm(exerciseName),
    name: exerciseName,
    available: false,
    provider: 'none',
    description: 'Follow the written instructions for this movement.',
    formCues: ['Move within a comfortable range', 'Breathe steadily', 'Stop if pain or unwell'],
    fallbackInstructions: `Follow on-screen instructions for ${exerciseName}. Stop if anything feels unsafe.`,
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
  return [...DEMOS];
}

export function listAvailableVideoExercises(): string[] {
  return DEMOS.filter((d) => d.available).map((d) => d.name);
}

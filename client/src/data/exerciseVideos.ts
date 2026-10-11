/**
 * Exercise demonstration catalogue.
 *
 * Mapping key: normalized exercise name (lowercase, trimmed).
 * Video URLs are only set when a permitted, verified source is available.
 * Currently all entries use written form-cue fallbacks — no invented URLs.
 *
 * To add a real demo later:
 * 1. Obtain a permitted embed source (e.g. your own hosted MP4, or a video
 *    you have rights to embed).
 * 2. Set available: true and fill youtubeVideoId or videoUrl.
 * 3. Add attribution/license fields.
 */

export type VideoProvider = 'none' | 'youtube' | 'self_hosted';

export interface ExerciseDemo {
  /** Stable key — normalized exercise name */
  key: string;
  /** Display name */
  name: string;
  /** Whether a playable video is configured */
  available: boolean;
  provider: VideoProvider;
  /** YouTube video id only (not a full URL) — optional */
  youtubeVideoId?: string;
  /** Direct MP4/WebM URL for self-hosted — optional */
  videoUrl?: string;
  /** Short demo description */
  description: string;
  /** Form / safety cues shown beside or instead of video */
  formCues: string[];
  /** Full written fallback instructions */
  fallbackInstructions: string;
  /** Attribution text when a video is present */
  attribution?: string;
  /** License note when a video is present */
  licenseNote?: string;
}

function norm(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Core demos for exercises used in curated + generator catalogues */
const DEMOS: ExerciseDemo[] = [
  {
    key: norm('March in Place'),
    name: 'March in Place',
    available: false,
    provider: 'none',
    description: 'Gentle marching to raise heart rate.',
    formCues: [
      'Stand tall, soft knees',
      'Lift knees to a comfortable height',
      'Swing arms naturally',
      'Keep breathing steady',
    ],
    fallbackInstructions:
      'Stand tall and march in place. Lift each knee gently and swing your arms. Keep a steady rhythm. Stop if you feel dizzy or unwell.',
  },
  {
    key: norm('Bodyweight Squats'),
    name: 'Bodyweight Squats',
    available: false,
    provider: 'none',
    description: 'Sit-back squat pattern for legs and glutes.',
    formCues: [
      'Feet about shoulder-width',
      'Sit hips back as if to a chair',
      'Keep chest lifted',
      'Knees track over toes',
    ],
    fallbackInstructions:
      'Stand with feet shoulder-width. Sit your hips back and down as if sitting into a chair. Keep your chest up. Drive through your feet to stand. Move within a comfortable range.',
  },
  {
    key: norm('Wall Push-ups'),
    name: 'Wall Push-ups',
    available: false,
    provider: 'none',
    description: 'Upper-body push with reduced load.',
    formCues: [
      'Hands on wall at shoulder height',
      'Body in a straight line',
      'Lower chest toward wall',
      'Push away with control',
    ],
    fallbackInstructions:
      'Place hands on a wall at about shoulder height. Step back slightly. Lower your chest toward the wall, then push away. Keep your body roughly straight. Reduce range if shoulders feel strained.',
  },
  {
    key: norm('Standing Knee Raises'),
    name: 'Standing Knee Raises',
    available: false,
    provider: 'none',
    description: 'Single-leg lift for core and balance.',
    formCues: [
      'Hold a chair for balance if needed',
      'Lift one knee toward chest',
      'Pause briefly at the top',
      'Alternate sides',
    ],
    fallbackInstructions:
      'Stand tall. Lift one knee toward your chest, pause, then lower. Alternate sides. Hold a stable surface for balance if needed.',
  },
  {
    key: norm('Glute Bridge'),
    name: 'Glute Bridge',
    available: false,
    provider: 'none',
    description: 'Hip extension on the floor.',
    formCues: [
      'Lie on back, knees bent',
      'Feet flat on floor',
      'Lift hips and squeeze glutes',
      'Lower with control',
    ],
    fallbackInstructions:
      'Lie on your back with knees bent and feet flat. Press through your heels to lift hips toward the ceiling. Squeeze glutes at the top, then lower slowly. Avoid arching the lower back aggressively.',
  },
  {
    key: norm('Cool Down Stretch'),
    name: 'Cool Down Stretch',
    available: false,
    provider: 'none',
    description: 'Easy full-body stretch and breathing.',
    formCues: [
      'Reach arms overhead',
      'Gentle forward fold if comfortable',
      'Breathe slowly',
      'No forcing into pain',
    ],
    fallbackInstructions:
      'Stand or sit tall. Reach arms overhead, then gently fold forward if comfortable. Breathe deeply. Never force a stretch into pain.',
  },
  {
    key: norm('Side Steps'),
    name: 'Side Steps',
    available: false,
    provider: 'none',
    description: 'Lateral stepping for light cardio.',
    formCues: ['Step side to side', 'Soft knees', 'Arms swing naturally', 'Stay upright'],
    fallbackInstructions:
      'Step side to side at a comfortable pace. Keep knees soft and swing arms naturally. Reduce range if balance is challenging.',
  },
  {
    key: norm('Arm Circles + March'),
    name: 'Arm Circles + March',
    available: false,
    provider: 'none',
    description: 'Combined arm circles and gentle march.',
    formCues: ['Small controlled arm circles', 'March lightly in place', 'Reverse circle direction halfway'],
    fallbackInstructions:
      'March gently in place while making small arm circles. Reverse circle direction halfway through. Keep shoulders relaxed.',
  },
  {
    key: norm('Step Touches'),
    name: 'Step Touches',
    available: false,
    provider: 'none',
    description: 'Side step and touch pattern.',
    formCues: ['Step out to the side', 'Touch other foot in', 'Alternate sides', 'Optional arm reach'],
    fallbackInstructions:
      'Step one foot out to the side, then bring the other foot to touch. Alternate sides. Add a light arm reach if comfortable.',
  },
  {
    key: norm('Gentle Step Jacks'),
    name: 'Gentle Step Jacks',
    available: false,
    provider: 'none',
    description: 'Low-impact jumping-jack pattern without jumps.',
    formCues: ['Step one foot out at a time', 'Raise arms as you step', 'No jumping required'],
    fallbackInstructions:
      'Step one foot out to the side while raising your arms, then return. Alternate sides. No jumping required.',
  },
  {
    key: norm('Gentle Jumping Jacks (or Step Jacks)'),
    name: 'Gentle Jumping Jacks (or Step Jacks)',
    available: false,
    provider: 'none',
    description: 'Step-jack variation.',
    formCues: ['Prefer step-jacks over jumps', 'Raise arms with each step-out', 'Land soft if you choose small jumps'],
    fallbackInstructions:
      'Prefer step-jacks: step one foot out while raising arms, then switch. Skip jumping if impact feels high.',
  },
  {
    key: norm('Cool Down Walk'),
    name: 'Cool Down Walk',
    available: false,
    provider: 'none',
    description: 'Slow march to bring heart rate down.',
    formCues: ['Slow march', 'Deep breaths', 'Relax shoulders'],
    fallbackInstructions: 'Slow march in place and breathe deeply to bring your heart rate down.',
  },
  {
    key: norm('Bird Dog'),
    name: 'Bird Dog',
    available: false,
    provider: 'none',
    description: 'Opposite arm and leg reach for stability.',
    formCues: ['On all fours', 'Extend opposite arm and leg', 'Keep hips level', 'Move slowly'],
    fallbackInstructions:
      'On all fours, extend one arm and the opposite leg. Keep hips level. Hold briefly, then switch. Move slowly.',
  },
  {
    key: norm('Dead Bug (Modified)'),
    name: 'Dead Bug (Modified)',
    available: false,
    provider: 'none',
    description: 'Supine core control with opposite arm/leg.',
    formCues: ['On back, arms up, knees bent', 'Extend opposite arm and leg', 'Keep lower back gently pressed'],
    fallbackInstructions:
      'Lie on your back with arms up and knees bent. Slowly extend one arm and the opposite leg, then return. Keep the lower back comfortable.',
  },
  {
    key: norm('Pelvic Tilts'),
    name: 'Pelvic Tilts',
    available: false,
    provider: 'none',
    description: 'Small pelvic motion to mobilize the lower back.',
    formCues: ['On back, knees bent', 'Gently flatten lower back', 'Release with control'],
    fallbackInstructions:
      'Lie on your back with knees bent. Gently tilt the pelvis to flatten the lower back, then release. Small, comfortable motion only.',
  },
  {
    key: norm('Side-Lying Leg Lifts'),
    name: 'Side-Lying Leg Lifts',
    available: false,
    provider: 'none',
    description: 'Side-lying hip abduction.',
    formCues: ['Lie on one side', 'Lift top leg with control', 'Switch sides halfway'],
    fallbackInstructions:
      'Lie on one side. Lift the top leg slowly, then lower. Switch sides halfway through the interval.',
  },
  {
    key: norm("Child's Pose Stretch"),
    name: "Child's Pose Stretch",
    available: false,
    provider: 'none',
    description: 'Kneeling rest stretch.',
    formCues: ['Kneel and fold forward', 'Arms forward or by sides', 'Breathe into the back'],
    fallbackInstructions:
      'Kneel and fold forward with arms extended or by your sides. Rest and breathe. Use a seated forward fold if kneeling is uncomfortable.',
  },
  {
    key: norm('Chair Squats'),
    name: 'Chair Squats',
    available: false,
    provider: 'none',
    description: 'Squat to a chair for support.',
    formCues: ['Stand in front of a stable chair', 'Sit back lightly to the seat', 'Stand without using momentum'],
    fallbackInstructions:
      'Stand in front of a stable chair. Sit back until you lightly touch the seat, then stand. Use the chair only as a target or light touch.',
  },
  {
    key: norm('Seated March'),
    name: 'Seated March',
    available: false,
    provider: 'none',
    description: 'Seated knee lifts.',
    formCues: ['Sit tall', 'Lift knees alternately', 'Hold chair sides if needed'],
    fallbackInstructions: 'Sit tall in a stable chair. Lift one knee at a time in a marching pattern.',
  },
  {
    key: norm('Standing Hip Extensions'),
    name: 'Standing Hip Extensions',
    available: false,
    provider: 'none',
    description: 'Standing leg reach backward.',
    formCues: ['Hold support if needed', 'Reach one leg straight back', 'Keep torso upright'],
    fallbackInstructions:
      'Stand tall, hold a support if needed. Reach one leg straight back without arching the lower back. Alternate sides.',
  },
  {
    key: norm('Box Breathing'),
    name: 'Box Breathing',
    available: false,
    provider: 'none',
    description: 'Equal inhale, hold, exhale, hold.',
    formCues: ['Inhale 4 counts', 'Hold 4', 'Exhale 4', 'Hold 4'],
    fallbackInstructions:
      'Inhale for about four counts, hold four, exhale four, hold four. Repeat calmly. Stop if you feel lightheaded.',
  },
  {
    key: norm('Knee Push-ups'),
    name: 'Knee Push-ups',
    available: false,
    provider: 'none',
    description: 'Push-up from the knees.',
    formCues: ['Hands under shoulders', 'Knees on floor', 'Lower chest, then push up', 'Body roughly straight from knees to head'],
    fallbackInstructions:
      'From a kneeling position with hands under shoulders, lower your chest toward the floor and push back up. Keep the body roughly straight from knees to head.',
  },
  {
    key: norm('Reverse Lunges (gentle)'),
    name: 'Reverse Lunges (gentle)',
    available: false,
    provider: 'none',
    description: 'Step-back lunge with control.',
    formCues: ['Step one foot back', 'Lower until comfortable', 'Front knee tracks forward', 'Hold support if needed'],
    fallbackInstructions:
      'Step one foot back and lower until comfortable. Keep the front knee tracking forward. Hold a support if balance is hard. Alternate sides.',
  },
];

const BY_KEY = new Map(DEMOS.map((d) => [d.key, d]));

export function getExerciseDemo(exerciseName: string | undefined | null): ExerciseDemo | null {
  if (!exerciseName) return null;
  return BY_KEY.get(norm(exerciseName)) ?? null;
}

/** Generic fallback when exercise is unknown */
export function getGenericDemo(exerciseName: string): ExerciseDemo {
  return {
    key: norm(exerciseName),
    name: exerciseName,
    available: false,
    provider: 'none',
    description: 'Follow the written instructions for this movement.',
    formCues: [
      'Move within a comfortable range',
      'Breathe steadily',
      'Stop if you feel pain or unwell',
    ],
    fallbackInstructions: `Follow the on-screen instructions for ${exerciseName}. Move slowly and stop if anything feels painful or unsafe.`,
  };
}

export function resolveDemo(exerciseName: string | undefined | null): ExerciseDemo {
  return getExerciseDemo(exerciseName) ?? getGenericDemo(exerciseName || 'Exercise');
}

/** YouTube embed URL builder — only call when youtubeVideoId is set and permitted */
export function youtubeEmbedSrc(videoId: string): string {
  // modestbranding + playsinline; no invented ids should be passed here
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
}

export function listDemoCatalogue(): ExerciseDemo[] {
  return [...DEMOS];
}

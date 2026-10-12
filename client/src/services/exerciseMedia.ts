/**
 * Exercise media adapter
 *
 * Primary images: yuhonas/free-exercise-db (Unlicense / public domain)
 *   JSON:  https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
 *   Images: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{path}
 *
 * Optional GIFs: oss.exercisedb.dev free API (attribution required; non-commercial free tier)
 *   GET https://oss.exercisedb.dev/api/v1/exercises
 *   gifUrl: https://static.exercisedb.dev/media/{id}.gif
 *
 * YouTube embeds remain optional tertiary demos (see exerciseVideos.ts).
 */

const FEDB_IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export type MediaKind = 'image' | 'gif' | 'youtube' | 'none';

export interface ResolvedMedia {
  key: string;
  name: string;
  /** Still image URL (public domain free-exercise-db when mapped) */
  imageUrl?: string;
  /** Animated GIF URL (ExerciseDB free tier when mapped) */
  gifUrl?: string;
  /** YouTube video id if configured */
  youtubeVideoId?: string;
  mediaKind: MediaKind;
  formCues: string[];
  instructions: string;
  attribution: string[];
  sourceLabel: string;
}

function norm(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ');
}

/** Map FitTV exercise names → free-exercise-db image path (verified against dist/exercises.json) */
const FEDB_IMAGE_MAP: Record<string, { path: string; fedbName: string }> = {
  [norm('Bodyweight Squats')]: { path: 'Bodyweight_Squat/0.jpg', fedbName: 'Bodyweight Squat' },
  [norm('Bodyweight Squat')]: { path: 'Bodyweight_Squat/0.jpg', fedbName: 'Bodyweight Squat' },
  [norm('Chair Squats')]: { path: 'Chair_Squat/0.jpg', fedbName: 'Chair Squat' },
  [norm('Chair Squat')]: { path: 'Chair_Squat/0.jpg', fedbName: 'Chair Squat' },
  [norm('Glute Bridge')]: { path: 'Single_Leg_Glute_Bridge/0.jpg', fedbName: 'Single Leg Glute Bridge' },
  [norm('Dead Bug (Modified)')]: { path: 'Dead_Bug/0.jpg', fedbName: 'Dead Bug' },
  [norm('Dead Bug')]: { path: 'Dead_Bug/0.jpg', fedbName: 'Dead Bug' },
  [norm("Child's Pose Stretch")]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm("Child's Pose")]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm('Knee Push-ups')]: { path: 'Incline_Push-Up/0.jpg', fedbName: 'Incline Push-Up' },
  [norm('Wall Push-ups')]: { path: 'Incline_Push-Up/0.jpg', fedbName: 'Incline Push-Up' },
  [norm('Reverse Lunges (gentle)')]: {
    path: 'Bodyweight_Walking_Lunge/0.jpg',
    fedbName: 'Bodyweight Walking Lunge',
  },
  [norm('Side-Lying Leg Lifts')]: { path: 'Side_Leg_Raises/0.jpg', fedbName: 'Side Leg Raises' },
  [norm('Gentle Step Jacks')]: { path: 'Mountain_Climbers/0.jpg', fedbName: 'Mountain Climbers' },
  [norm('Gentle Jumping Jacks (or Step Jacks)')]: {
    path: 'Mountain_Climbers/0.jpg',
    fedbName: 'Mountain Climbers',
  },
  [norm('Cool Down Stretch')]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm('Standing Knee Raises')]: {
    path: 'Step-up_with_Knee_Raise/0.jpg',
    fedbName: 'Step-up with Knee Raise',
  },
  [norm('Bird Dog')]: { path: 'Superman/0.jpg', fedbName: 'Superman' },
};

/**
 * Optional ExerciseDB GIF ids — only entries we discovered via the free API.
 * Free tier: attribution to AscendAPI required; non-commercial use.
 */
const EDB_GIF_MAP: Record<string, { id: string; label: string }> = {
  [norm('Bodyweight Squats')]: { id: '6YUfHPL', label: 'quads (bodyweight squat)' },
  [norm('Bodyweight Squat')]: { id: '6YUfHPL', label: 'quads (bodyweight squat)' },
};

export function fedbImageUrl(path: string): string {
  return `${FEDB_IMAGE_BASE}${path}`;
}

export function edbGifUrl(exerciseId: string): string {
  return `https://static.exercisedb.dev/media/${exerciseId}.gif`;
}

/** Local SVG data-URI placeholder (no network) */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
      <rect fill="#0a151c" width="640" height="400"/>
      <rect x="40" y="40" width="560" height="320" rx="16" fill="#10232d" stroke="#8bd8ff" stroke-opacity="0.25"/>
      <text x="320" y="190" text-anchor="middle" fill="#8ba19a" font-family="system-ui,sans-serif" font-size="22">FitTV AI</text>
      <text x="320" y="225" text-anchor="middle" fill="#60756f" font-family="system-ui,sans-serif" font-size="14">Exercise guide</text>
    </svg>`
  );

export interface MediaLookupInput {
  name: string;
  formCues?: string[];
  fallbackInstructions?: string;
  youtubeVideoId?: string;
  availableYoutube?: boolean;
}

/**
 * Resolve media for an exercise name. Pure / sync — no network.
 * Prefer image + optional GIF; YouTube is optional enhancement.
 */
export function resolveExerciseMedia(input: MediaLookupInput): ResolvedMedia {
  const key = norm(input.name);
  const fedb = FEDB_IMAGE_MAP[key];
  const edb = EDB_GIF_MAP[key];
  const hasYt = !!(input.availableYoutube && input.youtubeVideoId);

  const attribution: string[] = [];
  let imageUrl: string | undefined;
  let gifUrl: string | undefined;
  let mediaKind: MediaKind = 'none';
  let sourceLabel = 'Written form guide';

  if (fedb) {
    imageUrl = fedbImageUrl(fedb.path);
    mediaKind = 'image';
    sourceLabel = 'Photo demonstration';
    attribution.push(
      `Image: free-exercise-db (${fedb.fedbName}) — public domain / Unlicense`
    );
  }

  if (edb) {
    gifUrl = edbGifUrl(edb.id);
    mediaKind = 'gif';
    sourceLabel = 'Animated demonstration';
    attribution.push(
      `GIF: ExerciseDB / AscendAPI free tier (${edb.label}) — attribution required; non-commercial free use`
    );
  }

  if (hasYt && input.youtubeVideoId) {
    // Keep youtube as optional playable layer; primary visual can still be image/gif
    attribution.push('Video: YouTube embed — subject to YouTube Terms of Service');
    if (mediaKind === 'none') {
      mediaKind = 'youtube';
      sourceLabel = 'Video demonstration';
    }
  }

  return {
    key,
    name: input.name,
    imageUrl,
    gifUrl,
    youtubeVideoId: hasYt ? input.youtubeVideoId : undefined,
    mediaKind,
    formCues: input.formCues || [
      'Move within a comfortable range',
      'Breathe steadily',
      'Stop if you feel pain or unwell',
    ],
    instructions:
      input.fallbackInstructions ||
      `Follow the on-screen instructions for ${input.name}.`,
    attribution,
    sourceLabel,
  };
}

/**
 * Exercise media adapter
 *
 * Priority:
 * 1. free-exercise-db still photos (Unlicense / public domain) — verified paths only
 * 2. Local FitTV form-guide SVGs for exercises with no good photo match
 * 3. Optional ExerciseDB free-tier GIF (attribution required)
 * 4. Optional YouTube embed (Play button)
 */

const FEDB_IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export type MediaKind = 'image' | 'gif' | 'youtube' | 'none';

export interface ResolvedMedia {
  key: string;
  name: string;
  imageUrl?: string;
  gifUrl?: string;
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

/**
 * Accurate free-exercise-db photo paths (HTTP 200 verified).
 * Only map when the photo reasonably matches the FitTV exercise.
 */
const FEDB_IMAGE_MAP: Record<string, { path: string; fedbName: string }> = {
  [norm('Bodyweight Squats')]: { path: 'Bodyweight_Squat/0.jpg', fedbName: 'Bodyweight Squat' },
  [norm('Bodyweight Squat')]: { path: 'Bodyweight_Squat/0.jpg', fedbName: 'Bodyweight Squat' },
  [norm('Chair Squats')]: { path: 'Chair_Squat/0.jpg', fedbName: 'Chair Squat' },
  [norm('Chair Squat')]: { path: 'Chair_Squat/0.jpg', fedbName: 'Chair Squat' },
  [norm('Glute Bridge')]: { path: 'Butt_Lift_Bridge/0.jpg', fedbName: 'Butt Lift (Bridge)' },
  [norm('Dead Bug (Modified)')]: { path: 'Dead_Bug/0.jpg', fedbName: 'Dead Bug' },
  [norm('Dead Bug')]: { path: 'Dead_Bug/0.jpg', fedbName: 'Dead Bug' },
  [norm("Child's Pose Stretch")]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm("Child's Pose")]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm('Cool Down Stretch')]: { path: 'Childs_Pose/0.jpg', fedbName: "Child's Pose" },
  [norm('Wall Push-ups')]: { path: 'Incline_Push-Up/0.jpg', fedbName: 'Incline Push-Up' },
  [norm('Knee Push-ups')]: { path: 'Pushups/0.jpg', fedbName: 'Pushups' },
  [norm('Reverse Lunges (gentle)')]: {
    path: 'Crossover_Reverse_Lunge/0.jpg',
    fedbName: 'Crossover Reverse Lunge',
  },
  [norm('Side-Lying Leg Lifts')]: { path: 'Side_Leg_Raises/0.jpg', fedbName: 'Side Leg Raises' },
  [norm('Standing Knee Raises')]: {
    path: 'Step-up_with_Knee_Raise/0.jpg',
    fedbName: 'Step-up with Knee Raise',
  },
  [norm('Bird Dog')]: { path: 'Superman/0.jpg', fedbName: 'Superman' },
  [norm('Pelvic Tilts')]: {
    path: 'Pelvic_Tilt_Into_Bridge/0.jpg',
    fedbName: 'Pelvic Tilt Into Bridge',
  },
  [norm('Standing Hip Extensions')]: {
    path: 'Hip_Extension_with_Bands/0.jpg',
    fedbName: 'Hip Extension with Bands',
  },
  [norm('Arm Circles + March')]: { path: 'Arm_Circles/0.jpg', fedbName: 'Arm Circles' },
};

/** Local instructional SVGs when no suitable free-db photo exists */
const LOCAL_GUIDE_MAP: Record<string, string> = {
  [norm('March in Place')]: '/exercises/march-in-place.svg',
  [norm('Side Steps')]: '/exercises/side-steps.svg',
  [norm('Step Touches')]: '/exercises/step-touches.svg',
  [norm('Gentle Step Jacks')]: '/exercises/step-jacks.svg',
  [norm('Gentle Jumping Jacks (or Step Jacks)')]: '/exercises/step-jacks.svg',
  [norm('Cool Down Walk')]: '/exercises/cool-down-walk.svg',
  [norm('Box Breathing')]: '/exercises/box-breathing.svg',
  [norm('Seated March')]: '/exercises/seated-march.svg',
};

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

export function resolveExerciseMedia(input: MediaLookupInput): ResolvedMedia {
  const key = norm(input.name);
  const fedb = FEDB_IMAGE_MAP[key];
  const local = LOCAL_GUIDE_MAP[key];
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
  } else if (local) {
    imageUrl = local;
    mediaKind = 'image';
    sourceLabel = 'Form guide card';
    attribution.push('Illustration: FitTV AI form guide (local)');
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

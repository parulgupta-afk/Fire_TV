/**
 * Exercise media adapter
 *
 * Priority (all bundled locally, so nothing breaks on a TV / offline demo):
 * 1. Two-frame photo demos from free-exercise-db (Unlicense / public domain),
 *    only where the photo really shows the same movement
 * 2. Animated FitTV form-guide SVGs (looping motion) drawn for the exact movement
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
  /** Start/end photo frames (cross-faded in the demo panel) */
  frames?: string[];
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
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ');
}

/**
 * Bundled free-exercise-db photos (start + end position).
 * Only mapped when the photo shows the same movement as the FitTV exercise.
 */
const LOCAL_PHOTO_MAP: Record<string, { slug: string; fedbName: string }> = {
  [norm('Bodyweight Squats')]: { slug: 'bodyweight-squats', fedbName: 'Bodyweight Squat' },
  [norm('Bodyweight Squat')]: { slug: 'bodyweight-squats', fedbName: 'Bodyweight Squat' },
  [norm('Glute Bridge')]: { slug: 'glute-bridge', fedbName: 'Butt Lift (Bridge)' },
  [norm('Dead Bug (Modified)')]: { slug: 'dead-bug', fedbName: 'Dead Bug' },
  [norm('Dead Bug')]: { slug: 'dead-bug', fedbName: 'Dead Bug' },
  [norm("Child's Pose Stretch")]: { slug: 'childs-pose', fedbName: "Child's Pose" },
  [norm("Child's Pose")]: { slug: 'childs-pose', fedbName: "Child's Pose" },
};

/** Animated local form-guide SVGs for the exact movement */
const LOCAL_GUIDE_MAP: Record<string, string> = {
  [norm('March in Place')]: '/exercises/march-in-place.svg',
  [norm('Side Steps')]: '/exercises/side-steps.svg',
  [norm('Step Touches')]: '/exercises/step-touches.svg',
  [norm('Gentle Step Jacks')]: '/exercises/step-jacks.svg',
  [norm('Gentle Jumping Jacks (or Step Jacks)')]: '/exercises/step-jacks.svg',
  [norm('Cool Down Walk')]: '/exercises/cool-down-walk.svg',
  [norm('Box Breathing')]: '/exercises/box-breathing.svg',
  [norm('Seated March')]: '/exercises/seated-march.svg',
  [norm('Chair Squats')]: '/exercises/chair-squats.svg',
  [norm('Chair Squat')]: '/exercises/chair-squats.svg',
  [norm('Wall Push-ups')]: '/exercises/wall-push-ups.svg',
  [norm('Knee Push-ups')]: '/exercises/knee-push-ups.svg',
  [norm('Reverse Lunges (gentle)')]: '/exercises/reverse-lunges.svg',
  [norm('Standing Knee Raises')]: '/exercises/standing-knee-raises.svg',
  [norm('Bird Dog')]: '/exercises/bird-dog.svg',
  [norm('Side-Lying Leg Lifts')]: '/exercises/side-lying-leg-lifts.svg',
  [norm('Pelvic Tilts')]: '/exercises/pelvic-tilts.svg',
  [norm('Standing Hip Extensions')]: '/exercises/standing-hip-extension.svg',
  [norm('Arm Circles + March')]: '/exercises/arm-circles-march.svg',
  [norm('Cool Down Stretch')]: '/exercises/cool-down-stretch.svg',
};

/** Optional GIFs (none mapped by default: the bundled demos are the reliable path) */
const EDB_GIF_MAP: Record<string, { id: string; label: string }> = {};

export function fedbImageUrl(path: string): string {
  return `${FEDB_IMAGE_BASE}${path}`;
}

export function localPhotoFrames(slug: string): string[] {
  return [`/exercises/photos/${slug}-0.jpg`, `/exercises/photos/${slug}-1.jpg`];
}

export function edbGifUrl(exerciseId: string): string {
  return `https://static.exercisedb.dev/media/${exerciseId}.gif`;
}

/** Every bundled media path (used by tests to make sure no file is missing) */
export function listLocalMediaPaths(): string[] {
  const photos = new Set(Object.values(LOCAL_PHOTO_MAP).map((p) => p.slug));
  return [
    ...Array.from(photos).flatMap((slug) => localPhotoFrames(slug)),
    ...Array.from(new Set(Object.values(LOCAL_GUIDE_MAP))),
  ];
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
  const photo = LOCAL_PHOTO_MAP[key];
  const local = LOCAL_GUIDE_MAP[key];
  const edb = EDB_GIF_MAP[key];
  const hasYt = !!(input.availableYoutube && input.youtubeVideoId);

  const attribution: string[] = [];
  let imageUrl: string | undefined;
  let frames: string[] | undefined;
  let gifUrl: string | undefined;
  let mediaKind: MediaKind = 'none';
  let sourceLabel = 'Written form guide';

  if (photo) {
    frames = localPhotoFrames(photo.slug);
    imageUrl = frames[0];
    mediaKind = 'image';
    sourceLabel = 'Photo demonstration';
    attribution.push(
      `Image: free-exercise-db (${photo.fedbName}) — public domain / Unlicense`
    );
  } else if (local) {
    imageUrl = local;
    mediaKind = 'image';
    sourceLabel = 'Animated form guide';
    attribution.push('Illustration: FitTV AI animated form guide');
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
    frames,
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

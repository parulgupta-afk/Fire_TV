import React, { useState, useEffect } from 'react';
import { AlertCircle, Play, RefreshCw, Video, VideoOff } from 'lucide-react';
import { ExerciseDemo, youtubeEmbedSrc } from '../data/exerciseVideos';
import { PLACEHOLDER_IMAGE } from '../services/exerciseMedia';

interface Props {
  demo: ExerciseDemo;
  isResting?: boolean;
}

/**
 * Shows exercise image / GIF / optional YouTube demo.
 * Workout timer is independent of this component.
 */
export function ExerciseDemoPanel({ demo, isResting = false }: Props) {
  const [wantsPlay, setWantsPlay] = useState(false);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [imgError, setImgError] = useState(false);
  const [gifFailed, setGifFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const hasGif = !!demo.gifUrl && !gifFailed;
  const hasImage = !!demo.imageUrl;
  // A YouTube id is playable even when a photo/guide is shown first
  const hasYoutube = !!demo.youtubeVideoId;
  const hasSelf = demo.provider === 'self_hosted' && !!demo.videoUrl;
  const canOfferVideo = !isResting && (hasYoutube || hasSelf);

  const visualUrl = !isResting
    ? hasGif
      ? demo.gifUrl
      : hasImage
        ? demo.imageUrl
        : undefined
    : undefined;
  // Two photo frames (start/end) cross-fade to read as a short looping demo
  const photoFrames = !hasGif && demo.frames && demo.frames.length > 1 ? demo.frames : null;

  useEffect(() => {
    setWantsPlay(false);
    setLoadState('idle');
    setImgError(false);
    setGifFailed(false);
  }, [demo.key, isResting]);

  useEffect(() => {
    if (wantsPlay && canOfferVideo) setLoadState('loading');
  }, [wantsPlay, canOfferVideo, retryKey]);

  const onRetryVideo = () => {
    setRetryKey((k) => k + 1);
    setLoadState('loading');
    setWantsPlay(true);
  };

  const showVisual = !!visualUrl && !imgError;

  return (
    <div className="demo-panel">
      <div className="demo-media">
        {/* Primary: image or GIF (always visible when available) */}
        {!isResting && showVisual && !wantsPlay && (
          <div className="demo-visual-wrap">
            {photoFrames ? (
              photoFrames.map((src, i) => (
                <img
                  key={`${src}-${retryKey}`}
                  className={`demo-image demo-frame demo-frame-${i}`}
                  src={src}
                  alt={i === 0 ? `Demonstration: ${demo.name}` : ''}
                  aria-hidden={i === 0 ? undefined : true}
                  onLoad={() => setLoadState('ready')}
                  onError={() => setImgError(true)}
                />
              ))
            ) : (
              <img
                key={`${visualUrl}-${retryKey}`}
                className="demo-image"
                src={visualUrl}
                alt={`Demonstration: ${demo.name}`}
                onLoad={() => setLoadState('ready')}
                onError={() => {
                  // Broken GIF: fall back to the bundled image instead of an empty panel
                  if (hasGif && hasImage) setGifFailed(true);
                  else setImgError(true);
                }}
              />
            )}
            {canOfferVideo && (
              <button
                type="button"
                className="button primary demo-play-overlay"
                onClick={() => setWantsPlay(true)}
              >
                <Play size={18} /> Play video
              </button>
            )}
          </div>
        )}

        {/* YouTube / self-hosted after explicit Play */}
        {canOfferVideo && wantsPlay && hasYoutube && demo.youtubeVideoId && (
          <>
            {loadState === 'loading' && (
              <div className="demo-status">Loading demonstration…</div>
            )}
            {loadState === 'error' && (
              <div className="demo-status demo-error">
                <AlertCircle size={22} />
                <p>Video could not load. Showing the demo guide instead.</p>
                <button type="button" className="button secondary" onClick={onRetryVideo}>
                  <RefreshCw size={16} /> Retry video
                </button>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => {
                    setWantsPlay(false);
                    setLoadState('idle');
                  }}
                >
                  Back to demo
                </button>
              </div>
            )}
            <iframe
              key={`${demo.youtubeVideoId}-${retryKey}`}
              title={`Demonstration: ${demo.name}`}
              src={youtubeEmbedSrc(demo.youtubeVideoId, true)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="demo-iframe"
              onLoad={() => setLoadState((s) => (s === 'error' ? s : 'ready'))}
              style={{ opacity: loadState === 'error' ? 0 : 1 }}
            />
          </>
        )}

        {canOfferVideo && wantsPlay && hasSelf && demo.videoUrl && (
          <video
            key={`${demo.videoUrl}-${retryKey}`}
            className="demo-video"
            src={demo.videoUrl}
            controls
            playsInline
            autoPlay
            onLoadedData={() => setLoadState('ready')}
            onError={() => setLoadState('error')}
          />
        )}

        {/* Fallback: no media or image failed */}
        {!isResting && !showVisual && !wantsPlay && (
          <div className="demo-placeholder">
            {demo.available ? <Video size={28} /> : <VideoOff size={28} />}
            <p className="demo-placeholder-title">{demo.name}</p>
            <p className="demo-placeholder-sub">
              {canOfferVideo
                ? 'Press Play for a video demonstration.'
                : 'Written form guide — follow cues and the timer.'}
            </p>
            {canOfferVideo && (
              <button type="button" className="button primary" onClick={() => setWantsPlay(true)}>
                <Play size={18} /> Play demo
              </button>
            )}
            <img
              className="demo-placeholder-img"
              src={PLACEHOLDER_IMAGE}
              alt=""
              aria-hidden
            />
            <ul className="demo-cues">
              {demo.formCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        )}

        {isResting && (
          <div className="demo-placeholder">
            <p className="demo-placeholder-title">Rest interval</p>
            <p className="demo-placeholder-sub">
              Catch your breath. Next demonstration loads with the next exercise.
            </p>
          </div>
        )}
      </div>

      {!isResting && (
        <div className="demo-copy">
          <p className="demo-description">{demo.description}</p>
          <p className="demo-fallback">{demo.fallbackInstructions}</p>
          {(demo.attribution || demo.licenseNote) && (
            <p className="demo-attr">
              {demo.attribution}
              {demo.licenseNote ? ` · ${demo.licenseNote}` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

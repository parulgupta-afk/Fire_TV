import React, { useState, useEffect } from 'react';
import { AlertCircle, Play, RefreshCw, VideoOff } from 'lucide-react';
import { ExerciseDemo, youtubeEmbedSrc } from '../data/exerciseVideos';
import { PLACEHOLDER_IMAGE } from '../services/exerciseMedia';

interface Props {
  demo: ExerciseDemo;
  isResting?: boolean;
}

/**
 * Always tries to show a visual:
 * GIF → photo/local SVG → placeholder.
 * GIF failure does not hide the photo.
 */
export function ExerciseDemoPanel({ demo, isResting = false }: Props) {
  const [wantsPlay, setWantsPlay] = useState(false);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [gifFailed, setGifFailed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const hasYoutube = !!demo.youtubeVideoId;
  const hasSelf = demo.provider === 'self_hosted' && !!demo.videoUrl;
  const canOfferVideo = !isResting && (hasYoutube || hasSelf);

  // Prefer GIF only if it has not failed; else photo; else placeholder
  const stillSrc = !isResting
    ? demo.gifUrl && !gifFailed
      ? demo.gifUrl
      : demo.imageUrl && !imgFailed
        ? demo.imageUrl
        : PLACEHOLDER_IMAGE
    : undefined;

  useEffect(() => {
    setWantsPlay(false);
    setLoadState('idle');
    setGifFailed(false);
    setImgFailed(false);
  }, [demo.key, isResting]);

  useEffect(() => {
    if (wantsPlay && canOfferVideo) setLoadState('loading');
  }, [wantsPlay, canOfferVideo, retryKey]);

  const onStillError = () => {
    // If current still is the GIF, fall back to photo; if photo, use placeholder
    if (demo.gifUrl && !gifFailed && stillSrc === demo.gifUrl) {
      setGifFailed(true);
      return;
    }
    if (demo.imageUrl && !imgFailed && stillSrc === demo.imageUrl) {
      setImgFailed(true);
      return;
    }
  };

  const onRetryVideo = () => {
    setRetryKey((k) => k + 1);
    setLoadState('loading');
    setWantsPlay(true);
  };

  if (isResting) {
    return (
      <div className="demo-panel">
        <div className="demo-media">
          <div className="demo-placeholder">
            <p className="demo-placeholder-title">Rest interval</p>
            <p className="demo-placeholder-sub">
              Next demonstration loads with the next exercise.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-panel">
      <div className="demo-media">
        {/* Video layer */}
        {canOfferVideo && wantsPlay && hasYoutube && demo.youtubeVideoId && (
          <>
            {loadState === 'loading' && (
              <div className="demo-status">Loading demonstration…</div>
            )}
            {loadState === 'error' && (
              <div className="demo-status demo-error">
                <AlertCircle size={22} />
                <p>Video could not load. Showing image guide.</p>
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
                  Back to image
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

        {/* Still image / GIF — always shown when not in video mode */}
        {!wantsPlay && stillSrc && (
          <div className="demo-visual-wrap">
            <img
              key={stillSrc}
              className="demo-image"
              src={stillSrc}
              alt={`Demonstration: ${demo.name}`}
              loading="eager"
              onError={onStillError}
            />
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

        {!wantsPlay && !stillSrc && (
          <div className="demo-placeholder">
            <VideoOff size={28} />
            <p className="demo-placeholder-title">{demo.name}</p>
            <p className="demo-placeholder-sub">Follow the form cues and timer.</p>
            <ul className="demo-cues">
              {demo.formCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
    </div>
  );
}

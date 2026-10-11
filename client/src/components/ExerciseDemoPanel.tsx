import React, { useState, useEffect } from 'react';
import { AlertCircle, Play, RefreshCw, Video, VideoOff } from 'lucide-react';
import { ExerciseDemo, youtubeEmbedSrc } from '../data/exerciseVideos';

interface Props {
  demo: ExerciseDemo;
  isResting?: boolean;
}

/**
 * Plays a configured demo when available; otherwise form cues.
 * Workout timer is independent of this component.
 */
export function ExerciseDemoPanel({ demo, isResting = false }: Props) {
  const [wantsPlay, setWantsPlay] = useState(false);
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [retryKey, setRetryKey] = useState(0);

  const hasYoutube = demo.available && demo.provider === 'youtube' && !!demo.youtubeVideoId;
  const hasSelf = demo.available && demo.provider === 'self_hosted' && !!demo.videoUrl;
  const canOfferVideo = !isResting && (hasYoutube || hasSelf);

  useEffect(() => {
    setWantsPlay(false);
    setLoadState('idle');
  }, [demo.key, isResting]);

  useEffect(() => {
    if (wantsPlay && canOfferVideo) setLoadState('loading');
  }, [wantsPlay, canOfferVideo, retryKey]);

  const onRetry = () => {
    setRetryKey((k) => k + 1);
    setLoadState('loading');
    setWantsPlay(true);
  };

  return (
    <div className="demo-panel">
      <div className="demo-media">
        {canOfferVideo && !wantsPlay && (
          <div className="demo-placeholder">
            <Video size={32} />
            <p className="demo-placeholder-title">{demo.name}</p>
            <p className="demo-placeholder-sub">Demonstration available — press Play when ready.</p>
            <button type="button" className="button primary" onClick={() => setWantsPlay(true)}>
              <Play size={18} /> Play demo
            </button>
            <ul className="demo-cues">
              {demo.formCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        )}

        {canOfferVideo && wantsPlay && hasYoutube && demo.youtubeVideoId && (
          <>
            {loadState === 'loading' && (
              <div className="demo-status">Loading demonstration…</div>
            )}
            {loadState === 'error' && (
              <div className="demo-status demo-error">
                <AlertCircle size={22} />
                <p>Video could not load. Use the form cues below.</p>
                <button type="button" className="button secondary" onClick={onRetry}>
                  <RefreshCw size={16} /> Retry
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

        {!canOfferVideo && (
          <div className="demo-placeholder">
            <VideoOff size={28} />
            <p className="demo-placeholder-title">
              {isResting ? 'Rest interval' : 'Form guide'}
            </p>
            <p className="demo-placeholder-sub">
              {isResting
                ? 'Next demonstration loads with the next exercise.'
                : 'Written demonstration — follow cues and the timer.'}
            </p>
            {!isResting && (
              <ul className="demo-cues">
                {demo.formCues.map((cue) => (
                  <li key={cue}>{cue}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {!isResting && (
        <div className="demo-copy">
          <p className="demo-description">{demo.description}</p>
          <p className="demo-fallback">{demo.fallbackInstructions}</p>
          {demo.attribution && (
            <p className="demo-attr">
              Source: {demo.attribution}
              {demo.licenseNote ? ` · ${demo.licenseNote}` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

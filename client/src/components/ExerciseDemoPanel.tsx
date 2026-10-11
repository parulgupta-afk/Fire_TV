import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, VideoOff } from 'lucide-react';
import { ExerciseDemo, youtubeEmbedSrc } from '../data/exerciseVideos';

interface Props {
  demo: ExerciseDemo;
  /** When true, hide heavy media (e.g. during rest) */
  isResting?: boolean;
}

/**
 * Shows exercise demonstration video when available; otherwise form cues + written fallback.
 * Timer is independent — this component never drives workout timing.
 */
export function ExerciseDemoPanel({ demo, isResting = false }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [retryKey, setRetryKey] = useState(0);

  const canPlay =
    !isResting &&
    demo.available &&
    ((demo.provider === 'youtube' && !!demo.youtubeVideoId) ||
      (demo.provider === 'self_hosted' && !!demo.videoUrl));

  useEffect(() => {
    if (canPlay) {
      setStatus('loading');
    } else {
      setStatus('idle');
    }
  }, [demo.key, canPlay, retryKey]);

  const onRetry = () => {
    setRetryKey((k) => k + 1);
    setStatus('loading');
  };

  return (
    <div className="demo-panel">
      <div className="demo-media">
        {canPlay && demo.provider === 'youtube' && demo.youtubeVideoId ? (
          <>
            {status === 'loading' && (
              <div className="demo-status">Loading demonstration…</div>
            )}
            {status === 'error' && (
              <div className="demo-status demo-error">
                <AlertCircle size={22} />
                <p>Video could not load. Use the form cues below.</p>
                <button type="button" className="button secondary" onClick={onRetry}>
                  <RefreshCw size={16} /> Retry video
                </button>
              </div>
            )}
            <iframe
              key={`${demo.youtubeVideoId}-${retryKey}`}
              title={`Demonstration: ${demo.name}`}
              src={youtubeEmbedSrc(demo.youtubeVideoId)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="demo-iframe"
              onLoad={() => setStatus('ready')}
              onError={() => setStatus('error')}
              style={{ opacity: status === 'error' ? 0 : 1 }}
            />
          </>
        ) : canPlay && demo.provider === 'self_hosted' && demo.videoUrl ? (
          <video
            key={`${demo.videoUrl}-${retryKey}`}
            className="demo-video"
            src={demo.videoUrl}
            controls
            playsInline
            onLoadedData={() => setStatus('ready')}
            onError={() => setStatus('error')}
          />
        ) : (
          <div className="demo-placeholder">
            <VideoOff size={28} />
            <p className="demo-placeholder-title">
              {isResting ? 'Rest interval' : 'Form guide'}
            </p>
            <p className="demo-placeholder-sub">
              {isResting
                ? 'Catch your breath. Next demo loads with the next exercise.'
                : 'Written demonstration — no external video required.'}
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
              {demo.attribution}
              {demo.licenseNote ? ` · ${demo.licenseNote}` : ''}
            </p>
          )}
          {!demo.available && (
            <p className="demo-attr">
              Video demo not configured for this exercise. Follow the form cues and timer.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, BarChart3, Flame } from 'lucide-react';

/** Exact brand mark from the FitTV design */
function BrandMark() {
  return (
    <svg className="brand-symbol" viewBox="0 0 88 88" aria-hidden="true" width={36} height={36}>
      <defs>
        <linearGradient id="fit-gradient" x1="12" y1="76" x2="78" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5fa9cf" />
          <stop offset=".52" stopColor="#8bd8ff" />
          <stop offset="1" stopColor="#d7f5ff" />
        </linearGradient>
      </defs>
      <circle cx="44" cy="44" r="35" fill="none" stroke="rgba(155,223,255,.28)" strokeWidth="2" />
      <path
        d="M24 58c-7-8-8-18-4-27C24 19 34 13 46 13c11 0 20 4 27 12L62 35c-4-5-9-7-15-7-8 0-14 6-14 15s6 15 14 15c6 0 11-2 15-7l11 10c-7 8-16 12-28 12-8 0-16-2-21-5Z"
        fill="url(#fit-gradient)"
      />
      <path d="M36 39h27v10H36z" fill="#082331" />
    </svg>
  );
}

interface Props {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function AppShell({ children, hideNav = false }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isHome = path === '/';
  const isTrain = path.startsWith('/personalize') || path.startsWith('/preview');
  const isProgress = path.startsWith('/progress');

  if (hideNav) {
    return <div className="app-shell" style={{ display: 'block' }}>{children}</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <BrandMark />
          <div>
            <strong>FitTV AI</strong>
            <span>Living room coach</span>
          </div>
        </div>

        <div className="tv-badge">
          <span className="pulse-ring" /> Living room mode
        </div>

        <nav className="main-nav">
          <button type="button" className={isHome ? 'active' : ''} onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Home</span>
            {isHome && <span className="nav-dot" />}
          </button>
          <button type="button" className={isTrain ? 'active' : ''} onClick={() => navigate('/personalize')}>
            <Dumbbell size={18} />
            <span>Train</span>
          </button>
          <button type="button" className={isProgress ? 'active' : ''} onClick={() => navigate('/progress')}>
            <BarChart3 size={18} />
            <span>Progress</span>
          </button>
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-spacer" />

        <div className="sidebar-profile">
          <div className="avatar">FT</div>
          <div>
            <strong>Guest athlete</strong>
            <span>
              {/** streak shown when available */}
              TV session <Flame size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </span>
          </div>
        </div>

        <div className="remote-footer">
          <span className="keycap">←</span>
          <span className="keycap">↑</span>
          <span className="keycap">↓</span>
          <span className="keycap">→</span>
          <span>Navigate</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-context">
            <span className="topbar-pill">
              <span className="live-dot" /> FITTV AI / BETA
            </span>
            <span className="topbar-copy">A coach that listens between the reps.</span>
          </div>
          <div className="topbar-actions">
            <span className="sync-status">
              <span /> Synced
            </span>
          </div>
        </header>
        <div className="content-scroll">{children}</div>
      </main>
    </div>
  );
}

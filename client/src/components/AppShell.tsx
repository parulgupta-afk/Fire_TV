import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, BarChart3, Settings2, Sparkles } from 'lucide-react';

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden>
      <span />
      <span />
      <span />
    </div>
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

  const isActive = (match: string) => {
    if (match === '/') return path === '/';
    return path.startsWith(match);
  };

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
          <span className="live-dot" />
          Fire TV ready
        </div>

        <nav className="main-nav">
          <button
            type="button"
            className={isActive('/') && !isActive('/personalize') && !isActive('/progress') ? 'active' : ''}
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            Home
          </button>
          <button
            type="button"
            className={isActive('/personalize') || isActive('/preview') ? 'active' : ''}
            onClick={() => navigate('/personalize')}
          >
            <Dumbbell size={18} />
            Train
            <span className="nav-dot" />
          </button>
          <button
            type="button"
            className={isActive('/progress') ? 'active' : ''}
            onClick={() => navigate('/progress')}
          >
            <BarChart3 size={18} />
            Progress
          </button>
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-spacer" />

        <div className="sidebar-profile">
          <div className="avatar">FT</div>
          <div>
            <strong>Guest athlete</strong>
            <span>TV session</span>
          </div>
        </div>
      </aside>

      <main className="content-scroll" style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

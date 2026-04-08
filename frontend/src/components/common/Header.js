import React from 'react';

function Header({
  selected,
  currentView,
  setSelected,
  setOutput,
  setStatusMessage,
  setCurrentView,
  user,
  userGroups,
  isLoading,
  theme,
  toggleTheme,
  handleLogout,
  showLoginModal,
  setShowLoginModal,
  setLoginSkipped,
  isDeveloperMode,
  setIsDeveloperMode
}) {
  const isDeveloper = user && userGroups && userGroups.includes('qipl.tda.developers');
  const pageTitle = selected ? `${selected.name} - TDA AI NEXUS` : currentView === 'feedback' ? 'Feedback - TDA AI NEXUS' : currentView === 'about' ? 'About Us - TDA AI NEXUS' : 'TDA AI NEXUS';
  return (
    <header style={{
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      borderTop: isDeveloperMode ? '4px solid #f59e0b' : '4px solid transparent',
      padding: '20px 28px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'background 0.3s, border-color 0.3s',
      flexWrap: 'wrap',
      gap: '16px',
      backdropFilter: 'blur(14px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
        <h1 onClick={currentView !== 'dashboard' ? () => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); window.history.pushState({view: 'dashboard'}, '', '#dashboard'); } : undefined} style={{
          margin: 0,
          color: 'var(--text-color)',
          background: 'none',
          fontSize: '1.9rem',
          fontWeight: 700,
          letterSpacing: '0.03em',
          cursor: currentView !== 'dashboard' ? 'pointer' : 'default',
          transition: 'opacity 0.3s'
        }}>
          {pageTitle}
        </h1>
        {isDeveloperMode && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px 10px',
            borderRadius: '999px',
            background: '#1f2937',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            DEV MODE
          </span>
        )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {selected && (
          <button onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); window.history.pushState({view: 'dashboard'}, '', '#dashboard'); }} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            userSelect: 'none'
          }} onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
            e.currentTarget.style.transform = 'scale(0.98)';
          }} onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}>
            <span style={{ fontSize: '1.2rem', pointerEvents: 'none' }}>🏠</span>
            <span style={{ pointerEvents: 'none' }}>Home</span>
          </button>
        )}
        <button onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('feedback'); window.history.pushState({view: 'feedback'}, '', '#feedback'); }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          userSelect: 'none'
        }} onMouseDown={(e) => {
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
          e.currentTarget.style.transform = 'scale(0.98)';
        }} onMouseUp={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <span style={{ fontSize: '1.2rem', pointerEvents: 'none' }}>💬</span>
          <span style={{ pointerEvents: 'none' }}>Feedback</span>
        </button>
        <button onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('about'); window.history.pushState({view: 'about'}, '', '#about'); }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          userSelect: 'none'
        }} onMouseDown={(e) => {
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
          e.currentTarget.style.transform = 'scale(0.98)';
        }} onMouseUp={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          e.currentTarget.style.transform = 'scale(1)';
        }}>
          <span style={{ fontSize: '1.2rem', pointerEvents: 'none' }}>ℹ️</span>
          <span style={{ pointerEvents: 'none' }}>About Us</span>
        </button>
        {isLoading ? (
          <span style={{ color: 'var(--secondary-text-color)', fontSize: '0.9rem' }}>loading...</span>
        ) : user ? (
          <span style={{
            color: 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: '500',
            padding: '4px 8px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'background 0.3s, border-color 0.3s, color 0.3s'
          }}>
            {user.email}
          </span>
        ) : null}
        <button onClick={toggleTheme} style={{
          padding: '10px 14px',
          background: 'transparent',
          color: 'var(--text-color)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '999px',
          cursor: 'pointer',
          minWidth: '52px'
        }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {isDeveloper && (
          <button onClick={() => setIsDeveloperMode(!isDeveloperMode)} title="Toggle Developer Mode" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: isDeveloperMode ? '#f59e0b' : 'transparent',
            color: isDeveloperMode ? 'white' : 'var(--text-color)',
            border: `1px solid ${isDeveloperMode ? '#f59e0b' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '999px',
            cursor: 'pointer',
            minWidth: '110px',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: '0.9rem' }}>⚙️</span>
            <span>{isDeveloperMode ? 'DEV ON' : 'DEV OFF'}</span>
          </button>
        )}
        <button onClick={user ? handleLogout : () => {
            setLoginSkipped(false);
            setShowLoginModal(true);
          }} style={{
          padding: '10px 16px',
          background: user ? 'rgba(255,255,255,0.12)' : 'var(--button-bg)',
          color: user ? 'var(--text-color)' : 'var(--button-text)',
          border: user ? '1px solid rgba(0,0,0,0.12)' : 'none',
          borderRadius: '999px',
          cursor: 'pointer',
          minWidth: '82px'
        }}>
          {user ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
}

export default Header;
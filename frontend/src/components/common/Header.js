import React from 'react';

function Header({
  selected,
  currentView,
  setSelected,
  setOutput,
  setStatusMessage,
  setCurrentView,
  user,
  isLoading,
  theme,
  toggleTheme,
  handleLogout,
  showLoginModal,
  setShowLoginModal,
  setLoginSkipped
}) {
  return (
    <header style={{
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 'var(--shadow)',
      transition: 'background 0.3s, border-color 0.3s',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <h1 onClick={currentView !== 'dashboard' ? () => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); window.history.pushState({view: 'dashboard'}, '', ''); } : undefined} style={{
        margin: 0,
        color: 'var(--text-color)',
        background: 'none',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textShadow: 'none',
        cursor: currentView !== 'dashboard' ? 'pointer' : 'default',
        transition: 'opacity 0.3s'
      }}>
        {selected ? `${selected.name} - TDA AI NEXUS` : 'TDA AI NEXUS'}
      </h1>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {selected && (
          <button onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); window.history.pushState({view: 'dashboard'}, '', ''); }} style={{
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
        <button onClick={() => { setCurrentView('feedback'); window.history.pushState({view: 'feedback'}, '', '#feedback'); }} style={{
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
        <button onClick={() => { setCurrentView('about'); window.history.pushState({view: 'about'}, '', '#about'); }} style={{
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
          <span style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>loading...</span>
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
          padding: '5px 10px',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer'
        }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button onClick={user ? handleLogout : () => {
            setLoginSkipped(false);
            setShowLoginModal(true);
          }} style={{
          padding: '5px 10px',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer'
        }}>
          {user ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
}

export default Header;
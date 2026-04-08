import React from 'react';
import { UI } from '../../constants';

function LoginModal({ showLoginModal, setShowLoginModal, setLoginSkipped, handleLogin, isLoading }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--modal-bg)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      transition: 'background 0.3s'
    }}>
      <div style={{
        background: 'var(--modal-card-bg)',
        padding: '20px',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--shadow)',
        width: 'min(90vw, 400px)',
        transition: 'background 0.3s',
        position: 'relative'
      }}>
        <button onClick={() => {
          setShowLoginModal(false);
          setLoginSkipped(true);
        }} style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: 'var(--text-color)'
        }}>×</button>
        <h2 style={{ color: 'var(--text-color)' }}>Login</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleLogin(
            formData.get('email'),
            formData.get('password'),
            formData.get('apiKey')
          );
        }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'var(--text-color)' }}>Email Address:</label>
            <input name="email" type="email" required style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--border-radius)',
              transition: 'background 0.3s, color 0.3s, border-color 0.3s'
            }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'var(--text-color)' }}>Password:</label>
            <input name="password" type="password" required style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--border-radius)',
              transition: 'background 0.3s, color 0.3s, border-color 0.3s'
            }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'var(--text-color)' }}>Qgenie API Key:</label>
            <input name="apiKey" type="password" required style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--input-border)',
              borderRadius: 'var(--border-radius)',
              transition: 'background 0.3s, color 0.3s, border-color 0.3s'
            }} />
          </div>
          <div style={{ marginBottom: '20px', fontSize: '14px' }}>
            <a href={UI.apiKeyCreationLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--link-color)', textDecoration: 'none' }}>
              Don't have an API key? Create one here.
            </a>
          </div>
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
import React, { useEffect, useRef } from 'react';

function ExecutionLogs({ logs, isDeveloperMode }) {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filter logs based on user type
  const displayLogs = isDeveloperMode 
    ? logs 
    : logs.filter(log => log.level === 'info');

  if (!displayLogs || displayLogs.length === 0) {
    return null;
  }

  const getLogColor = (level) => {
    switch (level) {
      case 'debug':
        return '#888';
      case 'info':
        return 'var(--text-color)';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      case 'success':
        return '#4caf50';
      default:
        return 'var(--text-color)';
    }
  };

  const getLogIcon = (level) => {
    switch (level) {
      case 'debug':
        return '🐛';
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'success':
        return '✅';
      default:
        return '📝';
    }
  };

  return (
    <div style={{
      background: 'var(--input-bg)',
      border: '1px solid var(--input-border)',
      borderRadius: 'var(--border-radius)',
      padding: 12,
      marginTop: 16,
      maxHeight: '200px',
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: '0.85rem',
      transition: 'background 0.3s, border-color 0.3s'
    }}>
      <h4 style={{ 
        color: 'var(--text-color)', 
        margin: '0 0 8px 0',
        fontSize: '0.95rem',
        fontWeight: '600'
      }}>
        📋 Execution Logs {isDeveloperMode && '(Developer Mode)'}
      </h4>
      
      <div style={{ 
        background: 'rgba(0,0,0,0.1)', 
        padding: '8px',
        borderRadius: '4px',
        maxHeight: '150px',
        overflowY: 'auto'
      }}>
        {displayLogs.map((log, idx) => (
          <div 
            key={idx}
            style={{
              color: getLogColor(log.level),
              marginBottom: '6px',
              padding: '4px 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '0.8rem'
            }}
          >
            <span style={{ marginTop: '2px' }}>{getLogIcon(log.level)}</span>
            <div style={{ flex: 1 }}>
              <span style={{ opacity: 0.7, marginRight: '8px' }}>
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span style={{ fontWeight: isDeveloperMode && log.level === 'debug' ? '500' : 'normal' }}>
                {log.message}
              </span>
            </div>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}

export default ExecutionLogs;

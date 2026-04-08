import React from 'react';
import ExecutionLogs from '../common/ExecutionLogs';

function ToolInterface({ selected, statusMessage, active, input, setInput, type, setType, output, submit, isLoading, logs, isDeveloperMode }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--border-radius)',
      padding: 24,
      boxShadow: 'var(--shadow)',
      transition: 'background 0.3s, border-color 0.3s',
      margin: 24,
      minHeight: 'calc(100vh - 160px)'
    }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: 'var(--text-color)', marginBottom: 12, fontSize: '1.1rem' }}>{statusMessage}</p>
        {!active && <p style={{ color: 'red', marginBottom: 12 }}>Need support contact: support@example.com</p>}
        {active && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'var(--text-color)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Type:</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{
                padding: '8px 12px',
                background: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                fontSize: '1rem'
              }}>
                <option value="text">Text</option>
                <option value="image">Image Prompt</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'var(--text-color)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Prompt:</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--input-border)',
                  borderRadius: 'var(--border-radius)',
                  transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            <button onClick={submit} disabled={!input.trim() || isLoading || !active} style={{
              padding: '12px 24px',
              background: !input.trim() || isLoading || !active ? 'var(--card-border)' : 'var(--button-bg)',
              color: !input.trim() || isLoading || !active ? 'var(--text-color)' : 'var(--button-text)',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: !input.trim() || isLoading || !active ? 'not-allowed' : 'pointer',
              transition: 'background 0.3s',
              fontSize: '1rem',
              marginRight: 12
            }}>
              {isLoading ? 'Processing...' : 'Send to Tool'}
            </button>
          </>
        )}
      </div>
      {output && (
        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: 'var(--border-radius)',
          padding: 16,
          marginTop: 20,
          transition: 'background 0.3s, border-color 0.3s'
        }}>
          <h3 style={{ color: 'var(--text-color)', marginTop: 0, marginBottom: 12 }}>Response:</h3>
          <pre style={{
            background: 'transparent',
            color: 'var(--text-color)',
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            {output}
          </pre>
        </div>
      )}
      <ExecutionLogs logs={logs} isDeveloperMode={isDeveloperMode} />
    </div>
  );
}

export default ToolInterface;
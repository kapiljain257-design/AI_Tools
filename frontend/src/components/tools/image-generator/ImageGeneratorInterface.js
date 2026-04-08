import React from 'react';
import ExecutionLogs from '../../common/ExecutionLogs';

function ImageGeneratorInterface({ statusMessage, active, input, setInput, output, submit, isLoading, logs, isDeveloperMode }) {
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
      {/* Tool Header */}
      <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--card-border)' }}>
        <h1 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.8rem', fontWeight: '600' }}>🎨 Image Generator</h1>
        <p style={{ color: 'var(--text-color)', margin: 0, opacity: 0.8 }}>Generate images from text descriptions</p>
      </div>

      {/* Status Section */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: 'var(--text-color)', marginBottom: 12, fontSize: '1.1rem' }}>{statusMessage}</p>
        {!active && <p style={{ color: 'red', marginBottom: 12 }}>Need support contact: support@example.com</p>}
      </div>

      {/* Input Section */}
      {active && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: 'var(--text-color)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>Image Description:</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '150px'
              }}
            />
          </div>

          <button onClick={submit} disabled={!input.trim() || isLoading} style={{
            padding: '12px 24px',
            background: !input.trim() || isLoading ? 'var(--card-border)' : 'var(--button-bg)',
            color: !input.trim() || isLoading ? 'var(--text-color)' : 'var(--button-text)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.3s',
            fontSize: '1rem',
            fontWeight: '500',
            marginRight: 12
          }}>
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </>
      )}

      {/* Output Section */}
      {output && (
        <div style={{
          background: 'var(--input-bg)',
          border: '1px solid var(--input-border)',
          borderRadius: 'var(--border-radius)',
          padding: 16,
          marginTop: 24,
          transition: 'background 0.3s, border-color 0.3s'
        }}>
          <h3 style={{ color: 'var(--text-color)', marginTop: 0, marginBottom: 12 }}>Generated Image:</h3>
          {output.startsWith('http') ? (
            <img src={output} alt="Generated" style={{ maxWidth: '100%', borderRadius: 'var(--border-radius)' }} />
          ) : (
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
          )}
        </div>
      )}

      {/* Execution Logs Section */}
      <ExecutionLogs logs={logs} isDeveloperMode={isDeveloperMode} />
    </div>
  );
}

export default ImageGeneratorInterface;

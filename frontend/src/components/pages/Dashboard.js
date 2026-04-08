import React, { useState, useEffect } from 'react';
import { API } from '../../constants';

function Dashboard({ tools, handleSelect }) {
  const [toolStatus, setToolStatus] = useState({});

  useEffect(() => {
    const checkToolStatuses = async () => {
      const statuses = {};
      for (const tool of tools) {
        try {
          const res = await fetch(API.endpoints.toolStatus(tool.id));
          const data = await res.json();
          statuses[tool.id] = data.active === true;
        } catch (err) {
          statuses[tool.id] = false;
        }
      }
      setToolStatus(statuses);
    };

    if (tools.length > 0) {
      checkToolStatuses();
      const interval = setInterval(checkToolStatuses, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [tools]);
  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 'var(--border-radius)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>Welcome back to TDA AI NEXUS</h2>
            <p style={{ marginTop: '12px', fontSize: '1rem', maxWidth: '650px' }}>
              Your secure AI toolbox is ready. Explore intelligent tools, generate results, and build faster with the same lightweight experience.
            </p>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🚀</span>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
        marginTop: 12
      }}>
        {tools.map(tool => (
          <div key={tool.id} onClick={() => handleSelect(tool)} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: 16,
            boxShadow: 'var(--shadow)',
            transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.2s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: toolStatus[tool.id] ? '#10b981' : '#ef4444',
              borderRadius: '0 var(--border-radius) 0 12px',
              fontSize: '1.2rem',
              title: toolStatus[tool.id] ? 'Service Running' : 'Service Offline'
            }}>
              ●
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{(() => {
                const icons = {
                  'nova': '🔤',
                  'indus-report': '📊',
                  'perfectto': '✨',
                  'repro-tool': '🔄',
                  'image-generator': '🎨'
                };
                return icons[tool.id] || '🛠️';
              })()}</span>
              <h3 style={{ color: 'var(--text-color)', margin: 0 }}>{tool.name}</h3>
            </div>
            <p style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '0.9rem' }}>{tool.description}</p>
            <p style={{ color: toolStatus[tool.id] ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>
              {toolStatus[tool.id] ? '✓ Service Running' : '✗ Service Offline'}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
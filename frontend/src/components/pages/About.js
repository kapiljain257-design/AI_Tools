import React from 'react';

function About() {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--border-radius)',
      padding: 32,
      boxShadow: 'var(--shadow)',
      transition: 'background 0.3s, border-color 0.3s',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '2.5rem',
        fontWeight: '700'
      }}>About TDA AI NEXUS</h2>
      <p style={{
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '1.2rem',
        lineHeight: '1.7'
      }}>
        TDA AI NEXUS is a comprehensive microservice tools dashboard designed to streamline AI-powered workflows.
        Our platform integrates multiple specialized tools to enhance productivity and efficiency.
      </p>
      <h3 style={{
        color: 'var(--text-color)',
        marginBottom: '24px',
        fontSize: '1.8rem',
        fontWeight: '600'
      }}>Features:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>🔗</span>
          <div>
            <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Multi-tool Integration</h4>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Seamlessly connect and manage multiple specialized tools in one unified dashboard.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>⚡</span>
          <div>
            <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Real-time Processing</h4>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Process your data and requests instantly with our high-performance backend infrastructure.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>🔐</span>
          <div>
            <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Secure API Key Management</h4>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Your API keys are encrypted and securely stored with industry-standard security protocols.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>🎨</span>
          <div>
            <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Light/Dark Theme Support</h4>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Customize your experience with light and dark themes for optimal viewing comfort.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '2rem' }}>📱</span>
          <div>
            <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.1rem' }}>Responsive Design</h4>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>Access your tools from any device with our fully responsive and mobile-friendly interface.</p>
          </div>
        </div>
      </div>
      <h3 style={{
        color: 'var(--text-color)',
        marginTop: '32px',
        marginBottom: '16px',
        fontSize: '1.8rem',
        fontWeight: '600'
      }}>Contact:</h3>
      <p style={{
        color: 'var(--text-color)',
        fontSize: '1.1rem'
      }}>
        For support, please contact: support@example.com
      </p>
    </div>
  );
}

export default About;
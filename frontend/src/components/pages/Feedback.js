import React from 'react';

function Feedback({ user, feedbackEmail, setFeedbackEmail, feedbackSubject, setFeedbackSubject, feedbackMessage, setFeedbackMessage }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: 'var(--border-radius)',
      padding: 32,
      boxShadow: 'var(--shadow)',
      transition: 'background 0.3s, border-color 0.3s',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: '16px',
        fontSize: '2rem',
        fontWeight: '600'
      }}>Feedback</h2>
      <p style={{
        color: 'var(--text-color)',
        textAlign: 'center',
        marginBottom: '24px',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>We value your feedback! Please share your thoughts about TDA AI NEXUS.</p>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!feedbackMessage) {
          alert('Message is required.');
          return;
        }
        if (!user && !feedbackEmail) {
          alert('Email is required for feedback.');
          return;
        }
        alert('Thank you for your feedback!');
        setFeedbackEmail('');
        setFeedbackSubject('');
        setFeedbackMessage('');
      }}>
        {user ? (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'var(--text-color)',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px'
            }}>Email Address:</label>
            <input
              type="email"
              value={user.email}
              readOnly
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                fontSize: '1rem'
              }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              color: 'var(--text-color)',
              fontWeight: '500',
              display: 'block',
              marginBottom: '8px'
            }}>Email Address:</label>
            <input
              type="email"
              value={feedbackEmail}
              onChange={e => setFeedbackEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--input-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.3s, color 0.3s, border-color 0.3s',
                fontSize: '1rem'
              }}
            />
          </div>
        )}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            color: 'var(--text-color)',
            fontWeight: '500',
            display: 'block',
            marginBottom: '8px'
          }}>Subject:</label>
          <input type="text" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} style={{
            width: '100%',
            padding: '12px',
            background: 'var(--input-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'background 0.3s, color 0.3s, border-color 0.3s',
            fontSize: '1rem'
          }} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            color: 'var(--text-color)',
            fontWeight: '500',
            display: 'block',
            marginBottom: '8px'
          }}>Message:</label>
          <textarea rows={6} value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} required style={{
            width: '100%',
            padding: '12px',
            background: 'var(--input-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--input-border)',
            borderRadius: 'var(--border-radius)',
            transition: 'background 0.3s, color 0.3s, border-color 0.3s',
            fontSize: '1rem',
            resize: 'vertical'
          }}></textarea>
        </div>
        <button type="submit" style={{
          width: '100%',
          padding: '14px',
          background: 'var(--button-bg)',
          color: 'var(--button-text)',
          border: 'none',
          borderRadius: 'var(--border-radius)',
          cursor: 'pointer',
          transition: 'background 0.3s, transform 0.2s',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default Feedback;
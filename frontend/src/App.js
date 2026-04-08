import React, { useEffect, useState } from 'react';
import { API, SUPPORT, UI, USER_GROUPS } from './constants';
import TeamInfo from './TeamInfo';

function App() {
  const [tools, setTools] = useState([]);
  const [selected, setSelected] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [active, setActive] = useState(false);
  const [input, setInput] = useState('');
  const [type, setType] = useState('text');
  const [output, setOutput] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]); // User's groups/lists
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginSkipped, setLoginSkipped] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    // Check for cached user session
    const cachedUser = localStorage.getItem('user');
    const cachedGroups = localStorage.getItem('userGroups');
    const skipped = localStorage.getItem('loginSkipped') === 'true';

    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      if (cachedGroups) {
        setUserGroups(JSON.parse(cachedGroups));
      }
      setLoginSkipped(false);
      setShowLoginModal(false);
    } else if (skipped) {
      setLoginSkipped(true);
      setShowLoginModal(false);
    } else {
      setShowLoginModal(true);
    }

    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user && userGroups.length > 0) {
      console.info('Fetching filtered tool list for groups:', userGroups);
      fetch(API.endpoints.filteredTools, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userGroups })
      })
        .then(res => res.json())
        .then(data => {
          console.info('Filtered tool list received', data.tools);
          setTools(data.tools || []);
        })
        .catch(err => {
          console.error('Failed to load filtered tools', err);
          setTools([]);
        });
    }
  }, [user, userGroups]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSelect = async tool => {
    if (isLoading) return;
    setSelected(tool);
    setCurrentView('dashboard');
    setStatusMessage('Checking tool status...');
    setOutput('');
    console.info(`Checking status for ${tool.id}`);

    try {
      const res = await fetch(API.endpoints.toolStatus(tool.id));
      const data = await res.json();
      if (data.active) {
        setActive(true);
        setStatusMessage(`Tool ${tool.name} is active. Enter prompt.`);
      } else {
        setActive(false);
        setStatusMessage(`${tool.name} ${SUPPORT.inactive}`);
      }
    } catch (err) {
      console.error('Status check failed', err);
      setActive(false);
      setStatusMessage(`${SUPPORT.error} Contact ${SUPPORT.email}`);
    }
  };

  const submit = async () => {
    if (!selected || isLoading) return;
    setStatusMessage(UI.processing);
    setOutput('');
    console.info(`Submit to tool ${selected.id}`, input, type);

    try {
      const res = await fetch(API.endpoints.toolProcess(selected.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt: input })
      });

      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { result: await res.text() };
      }

      console.info('Process response', data);
      const result = data.result || data.output || data.message || JSON.stringify(data);
      setOutput(result);
      setStatusMessage('Done');
    } catch (err) {
      console.error('Process request failed', err);
      setStatusMessage(SUPPORT.error);
    }
  };

  const handleLogin = (email, password, apiKey) => {
    // Simple validation
    if (!email || !password || !apiKey) {
      alert('All fields are required');
      return;
    }
    setIsLoading(true);
    // Simulate login delay and user group assignment
    setTimeout(() => {
      const userData = { email, apiKey };
      
      // Mock user group assignment based on email
      // In a real scenario, this would come from the backend
      let assignedGroups = [];
      if (email.includes('nova')) {
        assignedGroups.push(USER_GROUPS.NOVA_USERS);
      }
      if (email.includes('indus')) {
        assignedGroups.push(USER_GROUPS.INDUS_USERS);
      }
      if (email.includes('perfectto')) {
        assignedGroups.push(USER_GROUPS.PERFECTTO_USERS);
      }
      if (email.includes('repro')) {
        assignedGroups.push(USER_GROUPS.REPRO_USERS);
      }
      if (email.includes('tda') || email.includes('admin')) {
        assignedGroups.push(USER_GROUPS.TDA_DEVELOPERS);
      }
      
      // If no groups assigned, give default access
      if (assignedGroups.length === 0) {
        assignedGroups = [USER_GROUPS.NOVA_USERS];
      }

      setUser(userData);
      setUserGroups(assignedGroups);
      setLoginSkipped(false);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userGroups', JSON.stringify(assignedGroups));
      localStorage.removeItem('loginSkipped');
      setShowLoginModal(false);
      setCurrentView('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    setUserGroups([]);
    setLoginSkipped(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userGroups');
    localStorage.removeItem('loginSkipped');
    setShowLoginModal(true);
    setSelected(null);
    setStatusMessage('');
    setOutput('');
    setCurrentView('dashboard');
  };

  const SkeletonLoader = () => (
    <div style={{ padding: 24 }}>
      <div style={{
        height: '40px',
        background: 'var(--card-border)',
        borderRadius: 'var(--border-radius)',
        marginBottom: '20px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}></div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: 12,
            boxShadow: 'var(--shadow)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <div style={{
              height: '20px',
              background: 'var(--card-border)',
              borderRadius: '4px',
              marginBottom: '8px'
            }}></div>
            <div style={{
              height: '40px',
              background: 'var(--card-border)',
              borderRadius: '4px',
              marginBottom: '12px'
            }}></div>
            <div style={{
              height: '30px',
              background: 'var(--card-border)',
              borderRadius: 'var(--border-radius)'
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  const LoginModal = () => (
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
          localStorage.setItem('loginSkipped', 'true');
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

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: 'var(--bg-color)', minHeight: '100vh', transition: 'background 0.3s' }}>
      {/* Header */}
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
        <h1 onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); }} style={{
          margin: 0,
          color: 'var(--text-color)',
          background: 'none',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          textShadow: 'none',
          cursor: 'pointer',
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
          <button onClick={() => setCurrentView('feedback')} style={{
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
          <button onClick={() => setCurrentView('about')} style={{
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
          {selected && (
            <button onClick={() => { setSelected(null); setOutput(''); setStatusMessage(''); setCurrentView('dashboard'); }} style={{
              padding: '5px 10px',
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer'
            }}>
              Home
            </button>
          )}
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

      {/* Main Content */}
      {showLoginModal ? (
        <SkeletonLoader />
      ) : !user ? (
        <div style={{ padding: 24 }}>
          {currentView === 'dashboard' && <TeamInfo onLoginClick={() => {
            setShowLoginModal(true);
            setLoginSkipped(false);
            setCurrentView('dashboard');
          }} />}
          {currentView === 'feedback' && (
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
          )}
          {currentView === 'about' && (
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
          )}
        </div>
      ) : (
        <div style={{ padding: selected ? 0 : 24, minHeight: 'calc(100vh - 80px)' }}>
          {selected ? (
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
                    <button onClick={submit} disabled={!input.trim() || isLoading} style={{
                      padding: '12px 24px',
                      background: !input.trim() || isLoading ? 'var(--card-border)' : 'var(--button-bg)',
                      color: !input.trim() || isLoading ? 'var(--text-color)' : 'var(--button-text)',
                      border: 'none',
                      borderRadius: 'var(--border-radius)',
                      cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
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
            </div>
          ) : !selected && currentView === 'dashboard' && (
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
          )}

          {!selected && currentView === 'dashboard' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              marginTop: 12
            }}>
                  {tools.map(tool => {
                    const getToolIcon = (toolId) => {
                      const icons = {
                        'nova': '🔤',
                        'indus-report': '📊',
                        'perfectto': '✨',
                        'repro-tool': '🔄',
                        'image-generator': '🎨'
                      };
                      return icons[toolId] || '🛠️';
                    };

                    return (
                      <div key={tool.id} onClick={() => handleSelect(tool)} style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: 'var(--border-radius)',
                        padding: 16,
                        boxShadow: 'var(--shadow)',
                        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.2s',
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>{getToolIcon(tool.id)}</span>
                          <h3 style={{ color: 'var(--text-color)', margin: 0 }}>{tool.name}</h3>
                        </div>
                        <p style={{ color: 'var(--text-color)', marginBottom: '12px', fontSize: '0.9rem' }}>{tool.description}</p>
                      </div>
                    );
                  })}
                </div>
          )}

          {currentView === 'feedback' && (
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--border-radius)',
              padding: 24,
              boxShadow: 'var(--shadow)',
              transition: 'background 0.3s, border-color 0.3s'
            }}>
              <h2 style={{ color: 'var(--text-color)' }}>Feedback</h2>
              <p style={{ color: 'var(--text-color)' }}>We value your feedback! Please share your thoughts about TDA AI NEXUS.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!feedbackMessage) {
                  alert('Message is required.');
                  return;
                }
                alert('Thank you for your feedback!');
                setFeedbackSubject('');
                setFeedbackMessage('');
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ color: 'var(--text-color)' }}>Email Address:</label>
                  <input type="email" value={user.email} readOnly style={{
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
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ color: 'var(--text-color)' }}>Subject:</label>
                  <input type="text" value={feedbackSubject} onChange={e => setFeedbackSubject(e.target.value)} style={{
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
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ color: 'var(--text-color)' }}>Message:</label>
                  <textarea rows={6} value={feedbackMessage} onChange={e => setFeedbackMessage(e.target.value)} required style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '5px',
                    background: 'var(--input-bg)',
                    color: 'var(--text-color)',
                    border: '1px solid var(--input-border)',
                    borderRadius: 'var(--border-radius)',
                    transition: 'background 0.3s, color 0.3s, border-color 0.3s'
                  }}></textarea>
                </div>
                <button type="submit" style={{
                  padding: '10px 20px',
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'background 0.3s'
                }}>
                  Submit Feedback
                </button>
              </form>
            </div>
          )}

          {currentView === 'about' && (
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
                For support, please contact: <a href="mailto:support@example.com" style={{ color: 'var(--link-color)', textDecoration: 'none' }}>support@example.com</a>
              </p>
            </div>
          )}
        </div>
      )}

      {showLoginModal && <LoginModal />}
    </div>
  );
}

export default App;

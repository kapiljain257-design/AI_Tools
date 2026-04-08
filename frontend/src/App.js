import React, { useEffect, useLayoutEffect, useState } from 'react';
import { API, SUPPORT, UI, USER_GROUPS } from './constants';
import Header from './components/common/Header';
import LoginModal from './components/common/LoginModal';
import TeamInfo from './components/common/TeamInfo';
import Dashboard from './components/pages/Dashboard';
import ToolInterface from './components/pages/ToolInterface';
import Feedback from './components/pages/Feedback';
import About from './components/pages/About';
import NovaInterface from './components/tools/nova/NovaInterface';
import ImageGeneratorInterface from './components/tools/image-generator/ImageGeneratorInterface';
import IndustReportInterface from './components/tools/indus-report/IndustReportInterface';
import PerfectoInterface from './components/tools/perfectto/PerfectoInterface';
import ReproToolInterface from './components/tools/repro-tool/ReproToolInterface';

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
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' ? 'dark' : 'light';
  });
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginSkipped, setLoginSkipped] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [logs, setLogs] = useState([]); // Execution logs
  const [isDeveloperMode, setIsDeveloperMode] = useState(false); // Developer mode for debugging
  const [pendingToolId, setPendingToolId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization complete

  // Logger utility function
  const addLog = (message, level = 'info') => {
    const log = {
      message,
      level,
      timestamp: new Date()
    };
    setLogs(prevLogs => [...prevLogs.slice(-49), log]); // Keep last 50 logs
    
    // Also log to console
    if (level === 'debug') console.debug(`[DEBUG] ${message}`);
    else if (level === 'error') console.error(`[ERROR] ${message}`);
    else if (level === 'warning') console.warn(`[WARNING] ${message}`);
    else if (level === 'success') console.info(`[SUCCESS] ${message}`);
    else console.info(`[INFO] ${message}`);
  };

  const SECRET_PASSPHRASE = 'tda-ai-nexus-encryption-key';
  const STORAGE_SALT = 'tda-ai-nexus-salt-2026';

  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64) => {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const getCryptoKey = async () => {
    const enc = new TextEncoder();
    const passphraseKey = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(SECRET_PASSPHRASE),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(STORAGE_SALT),
        iterations: 250000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const encryptString = async (value) => {
    try {
      const key = await getCryptoKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        new TextEncoder().encode(value)
      );
      const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.byteLength);
      return arrayBufferToBase64(combined.buffer);
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  };

  const decryptString = async (base64Value) => {
    try {
      const combined = new Uint8Array(base64ToArrayBuffer(base64Value));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      const key = await getCryptoKey();
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Decryption failed:', error);
      return null;
    }
  };

  const setSecureItem = async (key, value) => {
    const encrypted = await encryptString(JSON.stringify(value));
    if (encrypted) {
      localStorage.setItem(key, encrypted);
      if (key === 'theme' && typeof value === 'string') {
        localStorage.setItem('theme', value);
      }
    }
  };

  const getSecureItem = async (key) => {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const decrypted = await decryptString(stored);
    if (!decrypted) return null;
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  };

  useEffect(() => {
    const loadSecureState = async () => {
      addLog('App initialized - checking cached session', 'info');
      const cachedUser = await getSecureItem('user');
      const cachedGroups = await getSecureItem('userGroups');
      const skipped = await getSecureItem('loginSkipped');
      const cachedTheme = await getSecureItem('theme');

      if (cachedUser) {
        setUser(cachedUser);
        if (Array.isArray(cachedGroups) && cachedGroups.length > 0) {
          setUserGroups(cachedGroups);
        }
        setLoginSkipped(false);
        setShowLoginModal(false);
        addLog('User session restored from secure storage', 'success');
      } else if (skipped === true || skipped === 'true') {
        setLoginSkipped(true);
        setShowLoginModal(false);
        addLog('Login was skipped previously', 'info');
      } else {
        setShowLoginModal(true);
        addLog('No cached session - showing login modal', 'info');
      }

      if (cachedTheme === 'dark' || cachedTheme === 'light') {
        addLog(`Restored theme from storage: ${cachedTheme}`, 'info');
        setTheme(cachedTheme);
      } else {
        addLog(`No cached theme found, using default: light`, 'info');
      }

      const pageHash = window.location.hash || '#dashboard';
      let routeView = 'dashboard';
      let routeSelected = null;

      if (pageHash.startsWith('#tool-')) {
        routeSelected = pageHash.replace('#tool-', '');
        routeView = 'dashboard';
        setPendingToolId(routeSelected);
        setCurrentView('dashboard');
        addLog(`Restoring route to tool: ${routeSelected}`, 'info');
      } else if (pageHash === '#about') {
        routeView = 'about';
        setCurrentView('about');
        addLog('Restoring route to About page', 'info');
      } else if (pageHash === '#feedback') {
        routeView = 'feedback';
        setCurrentView('feedback');
        addLog('Restoring route to Feedback page', 'info');
      } else {
        routeView = 'dashboard';
        setCurrentView('dashboard');
        addLog('Restoring route to Dashboard page', 'info');
      }

      window.history.replaceState({ view: routeView, selected: routeSelected }, '', pageHash);

      setIsInitialized(true);
    };

    loadSecureState();
  }, []);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isInitialized) {
      setSecureItem('theme', theme).catch(err => {
        console.warn('Failed to store theme securely', err);
      });
    }
  }, [theme, isInitialized]);

  useEffect(() => {
    setSecureItem('loginSkipped', loginSkipped).catch(err => {
      console.warn('Failed to store loginSkipped securely', err);
    });
  }, [loginSkipped]);

  // Developer mode toggle on Ctrl+Shift+D
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsDeveloperMode(prev => {
          const newMode = !prev;
          addLog(`Developer mode ${newMode ? 'ENABLED' : 'DISABLED'}`, 'debug');
          return newMode;
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const pushHistoryState = (view, selectedToolId = null) => {
    const url = view === 'dashboard'
      ? selectedToolId ? `#tool-${selectedToolId}` : '#dashboard'
      : view === 'feedback' ? '#feedback' : '#about';
    window.history.pushState({ view, selected: selectedToolId }, '', url);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const hash = window.location.hash;
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.selected) {
          setPendingToolId(event.state.selected);
          setSelected(prev => {
            if (prev && prev.id === event.state.selected) return prev;
            return null;
          });
        } else {
          setPendingToolId(null);
          setSelected(null);
        }
      } else if (hash.startsWith('#tool-')) {
        setCurrentView('dashboard');
        setPendingToolId(hash.replace('#tool-', ''));
      } else if (hash === '#about') {
        setCurrentView('about');
        setSelected(null);
      } else if (hash === '#feedback') {
        setCurrentView('feedback');
        setSelected(null);
      } else {
        setCurrentView('dashboard');
        setSelected(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user && userGroups.length > 0) {
      addLog(`Fetching filtered tool list for groups: ${userGroups.join(', ')}`, 'info');
      fetch(API.endpoints.filteredTools, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userGroups })
      })
        .then(res => res.json())
        .then(data => {
          addLog(`Filtered tool list received: ${data.tools?.length || 0} tools available`, 'success');
          setTools(data.tools || []);
        })
        .catch(err => {
          addLog(`Failed to load filtered tools: ${err.message}`, 'error');
          setTools([]);
        });
    }
  }, [user, userGroups]);

  useEffect(() => {
    if (isInitialized && tools.length > 0 && pendingToolId) {
      const tool = tools.find(t => t.id === pendingToolId);
      if (tool) {
        addLog(`Auto-selecting tool from route: ${pendingToolId}`, 'info');
        handleSelect(tool);
      } else {
        addLog(`Pending tool from route not found: ${pendingToolId}`, 'warning');
      }
      setPendingToolId(null);
    }
  }, [isInitialized, tools, pendingToolId]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addLog(`Theme switched to ${nextTheme}`, 'info');
  };

  const handleSelect = async tool => {
    if (isLoading) return;
    setSelected(tool);
    setCurrentView('dashboard');
    pushHistoryState('dashboard', tool.id);
    setStatusMessage('Checking tool status...');
    setOutput('');
    setLogs([]); // Clear logs when selecting new tool
    addLog(`Tool selected: ${tool.name} (${tool.id})`, 'info');
    addLog(`Checking status for ${tool.id}...`, 'debug');

    try {
      const res = await fetch(API.endpoints.toolStatus(tool.id));
      const data = await res.json();
      addLog(`Status check response received`, 'debug');
      if (data.active) {
        setActive(true);
        setStatusMessage(`Tool ${tool.name} is active. Enter prompt.`);
        addLog(`Tool ${tool.name} is ACTIVE and ready to use`, 'success');
      } else {
        setActive(false);
        setStatusMessage(`${tool.name} ${SUPPORT.inactive}`);
        addLog(`Tool ${tool.name} is INACTIVE - status: ${data.status || 'unknown'}`, 'warning');
      }
    } catch (err) {
      addLog(`Status check failed: ${err.message}`, 'error');
      setActive(false);
      setStatusMessage(`${SUPPORT.error} Contact ${SUPPORT.email}`);
    }
  };

  const submit = async () => {
    if (!selected || isLoading || !active) return;
    setStatusMessage(UI.processing);
    setOutput('');
    addLog(`Submitting request to tool: ${selected.id}`, 'info');
    addLog(`Mode/Type: ${type}`, 'debug');
    addLog(`Input length: ${input.length} characters`, 'debug');
    setIsLoading(true);

    try {
      addLog(`Sending request to: ${API.endpoints.toolProcess(selected.id)}`, 'debug');
      const res = await fetch(API.endpoints.toolProcess(selected.id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          prompt: input,
          userEmail: user?.email || 'anonymous',
          userGroups: userGroups || []
        })
      });

      addLog(`Response received - Status: ${res.status} ${res.statusText}`, 'debug');
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = { result: await res.text() };
      }

      addLog(`Processing response from ${selected.id}`, 'debug');
      const result = data.result || data.output || data.message || JSON.stringify(data);
      setOutput(result);
      setStatusMessage('Done');
      addLog(`Request completed successfully`, 'success');
    } catch (err) {
      addLog(`Request failed: ${err.message}`, 'error');
      setStatusMessage(SUPPORT.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (email, password, apiKey) => {
    // Simple validation
    if (!email || !password || !apiKey) {
      addLog('Login attempt failed - missing fields', 'warning');
      alert('All fields are required');
      return;
    }
    setIsLoading(true);
    addLog(`Login attempt for email: ${email}`, 'info');
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

      addLog(`User authenticated with groups: ${assignedGroups.join(', ')}`, 'success');
      setUser(userData);
      setUserGroups(assignedGroups);
      setLoginSkipped(false);
      setSecureItem('user', userData);
      setSecureItem('userGroups', assignedGroups);
      localStorage.removeItem('loginSkipped');
      setShowLoginModal(false);
      setCurrentView('dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    addLog(`User ${user?.email || 'unknown'} logged out`, 'info');
    setUser(null);
    setUserGroups([]);
    setLoginSkipped(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userGroups');
    localStorage.removeItem('loginSkipped');
    localStorage.removeItem('theme');
    setShowLoginModal(true);
    setSelected(null);
    setStatusMessage('');
    setOutput('');
    setLogs([]);
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

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: 'var(--bg-color)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <Header
        selected={selected}
        currentView={currentView}
        setSelected={setSelected}
        setOutput={setOutput}
        setStatusMessage={setStatusMessage}
        setCurrentView={setCurrentView}
        user={user}
        userGroups={userGroups}
        isLoading={isLoading}
        theme={theme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setLoginSkipped={setLoginSkipped}
        isDeveloperMode={isDeveloperMode}
        setIsDeveloperMode={setIsDeveloperMode}
      />

      {/* Main Content */}
      {!isInitialized ? (
        <div style={{ padding: 24, textAlign: 'center', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: 'var(--secondary-text-color)' }}>Initializing TDA AI NEXUS...</p>
          </div>
        </div>
      ) : showLoginModal ? (
        <SkeletonLoader />
      ) : !user ? (
        <div style={{ padding: 24 }}>
          {currentView === 'dashboard' && <TeamInfo onLoginClick={() => {
            setShowLoginModal(true);
            setLoginSkipped(false);
            setCurrentView('dashboard');
          }} />}
          {currentView === 'feedback' && <Feedback
            user={user}
            feedbackEmail={feedbackEmail}
            setFeedbackEmail={setFeedbackEmail}
            feedbackSubject={feedbackSubject}
            setFeedbackSubject={setFeedbackSubject}
            feedbackMessage={feedbackMessage}
            setFeedbackMessage={setFeedbackMessage}
          />}
          {currentView === 'about' && <About user={user} loginSkipped={loginSkipped} tools={tools} />}
        </div>
      ) : (
        <div style={{ padding: selected && currentView === 'dashboard' ? 0 : 24, minHeight: 'calc(100vh - 80px)' }}>
          {currentView === 'dashboard' ? (
            selected ? (() => {
              // Route to tool-specific component based on selected tool ID
              switch(selected.id) {
                case 'nova':
                  return <NovaInterface
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
                case 'image-generator':
                  return <ImageGeneratorInterface
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
                case 'indus-report':
                  return <IndustReportInterface
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
                case 'perfectto':
                  return <PerfectoInterface
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
                case 'repro-tool':
                  return <ReproToolInterface
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
                default:
                  return <ToolInterface
                    selected={selected}
                    statusMessage={statusMessage}
                    active={active}
                    input={input}
                    setInput={setInput}
                    type={type}
                    setType={setType}
                    output={output}
                    submit={submit}
                    isLoading={isLoading}
                    logs={logs}
                    isDeveloperMode={isDeveloperMode}
                  />;
              }
            })() : <Dashboard tools={tools} handleSelect={handleSelect} />
          ) : currentView === 'feedback' ? <Feedback
            user={user}
            feedbackEmail={feedbackEmail}
            setFeedbackEmail={setFeedbackEmail}
            feedbackSubject={feedbackSubject}
            setFeedbackSubject={setFeedbackSubject}
            feedbackMessage={feedbackMessage}
            setFeedbackMessage={setFeedbackMessage}
          /> : <About user={user} loginSkipped={loginSkipped} tools={tools} />}
        </div>
      )}

      {showLoginModal && <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        setLoginSkipped={setLoginSkipped}
        handleLogin={handleLogin}
        isLoading={isLoading}
      />}
    </div>
  );
}

export default App;

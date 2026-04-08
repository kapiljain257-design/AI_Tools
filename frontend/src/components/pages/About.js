import React from 'react';

function About({ user, loginSkipped, tools = [] }) {
  const teamMembers = [
    { name: 'Kapil Jain', role: 'Lead Architect & Developer', emoji: '👨‍💻', desc: 'Full-stack developer leading the TDA AI NEXUS platform architecture' },
    { name: 'AI Engineering Team', role: 'Backend & Integration', emoji: '🤖', desc: 'Expert team building and optimizing microservices and AI integrations' },
    { name: 'UX/UI Design Team', role: 'Frontend & Design', emoji: '🎨', desc: 'Crafting intuitive interfaces and seamless user experiences' },
    { name: 'DevOps & Infrastructure', role: 'Operations', emoji: '⚙️', desc: 'Ensuring reliability, scalability, and security of all services' }
  ];

  const missionStatements = [
    { title: 'Innovation', icon: '💡', desc: 'Push the boundaries of AI-powered productivity tools' },
    { title: 'Accessibility', icon: '🌍', desc: 'Make advanced AI tools available to everyone' },
    { title: 'Reliability', icon: '✅', desc: 'Provide rock-solid, always-on service' },
    { title: 'Security', icon: '🔐', desc: 'Protect user data with enterprise-grade encryption' }
  ];

  const availableTools = [
    { id: 'nova', name: 'Nova', icon: '🔤', desc: 'Advanced text processing and translation' },
    { id: 'indus-report', name: 'Indus Report', icon: '📊', desc: 'Comprehensive reporting and data analysis' },
    { id: 'perfectto', name: 'Perfectto', icon: '✨', desc: 'Quality assurance and optimization' },
    { id: 'repro-tool', name: 'Repro Tool', icon: '🔄', desc: 'Reproduction and testing framework' },
    { id: 'image-generator', name: 'Image Generator', icon: '🎨', desc: 'AI-powered image and visual content generation' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 'var(--border-radius)',
        padding: '40px',
        marginBottom: '40px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, fontSize: '200px', opacity: 0.1 }}>🚀</div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>About TDA AI NEXUS</h2>
        <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.6' }}>
          Your secure, comprehensive platform for AI-powered productivity. Seamlessly integrate advanced tools and enhance your workflow.
        </p>
      </div>

      {/* Mission Section */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '28px',
          fontSize: '2rem',
          fontWeight: '600'
        }}>Our Mission</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {missionStatements.map((mission, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--border-radius)',
              padding: '24px',
              boxShadow: 'var(--shadow)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{mission.icon}</div>
              <h4 style={{ color: 'var(--text-color)', margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '600' }}>
                {mission.title}
              </h4>
              <p style={{ color: 'var(--secondary-text-color)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                {mission.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '28px',
          fontSize: '2rem',
          fontWeight: '600'
        }}>Meet Our Team</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--border-radius)',
              padding: '28px',
              textAlign: 'center',
              boxShadow: 'var(--shadow)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                {member.emoji}
              </div>
              <h4 style={{
                color: 'var(--text-color)',
                margin: '0 0 4px 0',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {member.name}
              </h4>
              <p style={{
                color: '#667eea',
                margin: '0 0 12px 0',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {member.role}
              </p>
              <p style={{
                color: 'var(--secondary-text-color)',
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: '1.6'
              }}>
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Tools Section */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '28px',
          fontSize: '2rem',
          fontWeight: '600'
        }}>Available Tools</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}>
          {availableTools.map((tool, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--border-radius)',
              padding: '20px',
              boxShadow: 'var(--shadow)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{tool.icon}</div>
              <h4 style={{
                color: 'var(--text-color)',
                margin: '0 0 8px 0',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {tool.name}
              </h4>
              <p style={{
                color: 'var(--secondary-text-color)',
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '28px',
          fontSize: '2rem',
          fontWeight: '600'
        }}>Platform Features</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}>
          {[
            { icon: '🔗', title: 'Multi-tool Integration', desc: 'Seamlessly connect and manage multiple specialized tools' },
            { icon: '⚡', title: 'Real-time Processing', desc: 'High-performance backend infrastructure' },
            { icon: '🔐', title: 'Secure Storage', desc: 'Enterprise-grade encryption and security protocols' },
            { icon: '🎨', title: 'Theme Support', desc: 'Light and dark themes for optimal comfort' },
            { icon: '📱', title: 'Responsive Design', desc: 'Full mobile and tablet support' },
            { icon: '📊', title: 'Advanced Analytics', desc: 'Track usage and performance metrics' }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--border-radius)',
              padding: '20px',
              boxShadow: 'var(--shadow)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{feature.icon}</div>
              <h4 style={{
                color: 'var(--text-color)',
                margin: '0 0 8px 0',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {feature.title}
              </h4>
              <p style={{
                color: 'var(--secondary-text-color)',
                margin: 0,
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* User Status Section */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--border-radius)',
        padding: '28px',
        boxShadow: 'var(--shadow)',
        marginBottom: '40px'
      }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '16px',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>Your Status</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <p style={{ color: 'var(--secondary-text-color)', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '500' }}>
              Login Status
            </p>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
              {user ? (
                <span>✅ Logged in as <strong>{user.email}</strong></span>
              ) : (
                <span>⭕ Not logged in</span>
              )}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--secondary-text-color)', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '500' }}>
              Available Tools
            </p>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
              {availableTools.length} tools ready to use
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--secondary-text-color)', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '500' }}>
              Navigation Tips
            </p>
            <p style={{ color: 'var(--text-color)', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
              Use the Home button to return anytime
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--border-radius)',
        padding: '28px',
        boxShadow: 'var(--shadow)',
        textAlign: 'center'
      }}>
        <h3 style={{
          color: 'var(--text-color)',
          marginBottom: '16px',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>Get Support</h3>
        <p style={{
          color: 'var(--secondary-text-color)',
          marginBottom: '8px',
          fontSize: '1rem'
        }}>
          Have questions or need help?
        </p>
        <p style={{
          color: 'var(--text-color)',
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          📧 support@example.com
        </p>
      </div>
    </div>
  );
}

export default About;

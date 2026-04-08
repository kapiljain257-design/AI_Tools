import React from 'react';

const TeamInfo = ({ onLoginClick }) => {
  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '40px',
        color: 'var(--text-color)',
        fontSize: 'clamp(2rem, 5vw, 3rem)'
      }}>
        Meet Our Team
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '60px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--border-radius)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            👨‍💻
          </div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>John Doe</h3>
          <p style={{ color: 'var(--secondary-text-color)', marginBottom: '15px' }}>Lead Developer</p>
          <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Passionate about creating innovative AI solutions and leading development teams to build cutting-edge microservice architectures.
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--border-radius)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            👩‍🎨
          </div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Jane Smith</h3>
          <p style={{ color: 'var(--secondary-text-color)', marginBottom: '15px' }}>UI/UX Designer</p>
          <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Expert in creating intuitive user experiences and designing beautiful interfaces that users love to interact with.
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--border-radius)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            🔬
          </div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Dr. Alex Johnson</h3>
          <p style={{ color: 'var(--secondary-text-color)', marginBottom: '15px' }}>AI Research Scientist</p>
          <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Leading research in machine learning and AI, developing advanced algorithms for next-generation intelligent systems.
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--border-radius)',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white'
          }}>
            🚀
          </div>
          <h3 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Mike Chen</h3>
          <p style={{ color: 'var(--secondary-text-color)', marginBottom: '15px' }}>DevOps Engineer</p>
          <p style={{ color: 'var(--text-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Ensuring scalable, reliable, and secure deployment of AI applications with expertise in cloud infrastructure and automation.
          </p>
        </div>
      </div>

      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--border-radius)',
        padding: '40px',
        textAlign: 'center',
        boxShadow: 'var(--shadow)',
        marginBottom: '40px'
      }}>
        <h2 style={{ color: 'var(--text-color)', marginBottom: '20px' }}>Our Mission</h2>
        <p style={{
          color: 'var(--text-color)',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          At TDA AI NEXUS, we're dedicated to democratizing access to powerful AI tools through innovative microservice architectures.
          Our platform seamlessly integrates multiple AI services, providing developers and businesses with the tools they need to build
          the next generation of intelligent applications.
        </p>
      </div>

      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'var(--border-radius)',
        padding: '40px',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: '30px' }}>
          Available Tools (Login Required)
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🤖</div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>AI Text Generator</h4>
            <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Generate high-quality text content using advanced language models
            </p>
          </div>

          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Image Processor</h4>
            <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Advanced image analysis and processing capabilities
            </p>
          </div>

          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Data Analyzer</h4>
            <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Powerful data processing and analytics tools
            </p>
          </div>

          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Search Engine</h4>
            <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Intelligent search and discovery across multiple data sources
            </p>
          </div>

          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--border-radius)',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '10px' }}>Recommendation Engine</h4>
            <p style={{ color: 'var(--text-color)', fontSize: '0.9rem' }}>
              Personalized recommendations powered by machine learning
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => onLoginClick && onLoginClick()}
            style={{
              padding: '15px 30px',
              background: 'var(--button-bg)',
              color: 'var(--button-text)',
              border: 'none',
              borderRadius: 'var(--border-radius)',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            Login to Access Tools
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamInfo;
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 16px',
        background: '#fff',
        fontFamily: 'Sora, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '12px',
          lineHeight: '1.2',
        }}
      >
        Welcome to <br />
        <span style={{ color: '#6D50E2' }}>Live Polling System</span>
      </h1>

      <p
        style={{
          fontSize: '16px',
          color: '#555',
          textAlign: 'center',
          maxWidth: '500px',
          marginBottom: '30px',
        }}
      >
        Please choose your role to begin.
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '500px',
        }}
      >
        {/* Student Card */}
        <div
          onClick={() => navigate('/enter-name')}
          style={{
            padding: '18px',
            border: '2px solid #7451B6',
            borderRadius: '12px',
            background: '#f9f9f9',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontSize: '20px', margin: 0 }}>🎓 I’m a Student</h2>
          <p style={{ fontSize: '15px', margin: '8px 0 0', color: '#666' }}>
            Join polls, answer live questions, and see how you did.
          </p>
        </div>

        {/* Teacher Card */}
        <div
          onClick={() => navigate('/teacher')}
          style={{
            padding: '18px',
            border: '2px solid #CCC',
            borderRadius: '12px',
            background: '#f9f9f9',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ fontSize: '20px', margin: 0 }}>👩‍🏫 I’m a Teacher</h2>
          <p style={{ fontSize: '15px', margin: '8px 0 0', color: '#666' }}>
            Create polls and see student responses in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

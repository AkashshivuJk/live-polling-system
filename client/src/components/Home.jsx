import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: 'Sora, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: 700, textAlign: 'center' }}>
        Welcome to the <span style={{ fontWeight: 800 }}>Live Polling System</span>
      </h1>
      <p
        style={{
          fontSize: '18px',
          color: 'rgba(0,0,0,0.6)',
          textAlign: 'center',
          maxWidth: '600px',
          marginTop: '10px',
        }}
      >
        Please select the role that best describes you to begin using the live polling system.
      </p>

      {/* Cards container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '50px',
          width: '100%',
          maxWidth: '700px',
        }}
      >
        {/* Student Card */}
        <div
          onClick={() => navigate('/enter-name')}
          style={{
            padding: '20px',
            border: '3px solid #7765DA',
            borderRadius: '10px',
            cursor: 'pointer',
            background: '#F9F9F9',
            transition: 'transform 0.2s',
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 600 }}>I’m a Student</h2>
          <p style={{ fontSize: '16px', color: '#555' }}>
            Join a live session, answer questions, and view real-time results.
          </p>
        </div>

        {/* Teacher Card */}
        <div
          onClick={() => navigate('/teacher')}
          style={{
            padding: '20px',
            border: '1px solid #D9D9D9',
            borderRadius: '10px',
            cursor: 'pointer',
            background: '#F9F9F9',
            transition: 'transform 0.2s',
          }}
        >
          <h2 style={{ fontSize: '22px', fontWeight: 600 }}>I’m a Teacher</h2>
          <p style={{ fontSize: '16px', color: '#555' }}>
            Create polls, view live results, and manage your class in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

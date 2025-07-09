import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#FFF',
        position: 'relative',
        fontFamily: 'Sora, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'absolute',
          left: '50%',
          top: '25%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '40px', fontWeight: 700 }}>
          Welcome to the <span style={{ fontWeight: 800 }}>Live Polling System</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.6)' }}>
          Please select the role that best describes you to begin using the live polling system
        </p>
      </div>

      {/* Student Card */}
      <div
        style={{
          position: 'absolute',
          left: '25%',
          top: '50%',
          width: '300px',
          padding: '20px',
          border: '3px solid #7765DA',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/enter-name')}
      >
        <h2 style={{ fontSize: '23px', fontWeight: '600' }}>I’m a Student</h2>
        <p style={{ fontSize: '16px', color: '#454545' }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry
        </p>
      </div>

      {/* Teacher Card */}
      <div
        style={{
          position: 'absolute',
          left: '55%',
          top: '50%',
          width: '300px',
          padding: '20px',
          border: '1px solid #D9D9D9',
          borderRadius: '10px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/teacher')}
      >
        <h2 style={{ fontSize: '23px', fontWeight: '600' }}>I’m a Teacher</h2>
        <p style={{ fontSize: '16px', color: '#454545' }}>
          Submit answers and view live poll results in real-time.
        </p>
      </div>
    </div>
  );
};

export default Home;

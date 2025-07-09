import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterName = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem('studentName', name);
      navigate('/student');
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', background: '#fff'
    }}>
      <h1 style={{ fontSize: '40px', marginBottom: '10px' }}>Let’s <strong>Get Started</strong></h1>
      <p style={{ fontSize: '18px', maxWidth: '600px', textAlign: 'center', color: '#555' }}>
        If you’re a student, you’ll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates.
      </p>

      <div style={{ marginTop: '40px', width: '300px' }}>
        <label style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Enter your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            background: '#f2f2f2',
            border: 'none',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleContinue}
          style={{
            marginTop: '20px',
            padding: '10px 30px',
            background: 'linear-gradient(99deg, #8F64E1 -46.89%, #1D68BD 223.45%)',
            color: '#fff',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EnterName;

import React, { useState, useEffect } from 'react';
import socket from '../socket';
import PollQuestion from './PollQuestion';

const WaitingScreen = ({ message = "Waiting for the teacher to ask the next question..." }) => (
  <div style={{
    width: '100vw',
    height: '100vh',
    background: '#FFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }}>
    <svg width="57" height="58" viewBox="0 0 57 58" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
      <circle cx="28.5" cy="29" r="28.5" fill="#500ECE" />
    </svg>
    <h2 style={{
      fontSize: '28px',
      color: '#000',
      fontFamily: 'Sora',
      fontWeight: 700,
      textAlign: 'center'
    }}>
      {message}
    </h2>
  </div>
);

const Student = () => {
  const [name, setName] = useState(() => sessionStorage.getItem('studentName') || '');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [results, setResults] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // 💬 Chat State
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Send student name on join
  useEffect(() => {
    if (name) {
      socket.emit('student:join', { name });
      socket.emit('registerName', name, false); // 👈 Register name for chat
    }
  }, [name]);

  // Handle incoming question and results
  useEffect(() => {
    const handleQuestion = (data) => {
      setQuestion(data);
      setSubmitted(false);
      setAnswer('');
      setTimeLeft(data.duration || 60);
      setResults(null);
      setShowResult(false);
    };

    socket.on('new_question', handleQuestion);
    socket.on('send_question', handleQuestion);

    socket.on('update_results', (data) => setResults(data));

    socket.on('question_complete', () => {
      console.log('✅ Question complete event received (ignored)');
    });

    // 💬 Listen for chat messages
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('new_question', handleQuestion);
      socket.off('send_question', handleQuestion);
      socket.off('update_results');
      socket.off('question_complete');
      socket.off('chatMessage');
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (question && !submitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (question && !submitted && timeLeft === 0) {
      setSubmitted(true);
      setShowResult(true);
    }
  }, [question, submitted, timeLeft]);

  const handleSubmit = () => {
    if (!answer) return;
    socket.emit('student:submit_answer', { name, answerIndex: answer });
    setSubmitted(true);
    setShowResult(true);
  };

  const handleCloseResults = () => {
    setQuestion(null);
    setAnswer('');
    setSubmitted(false);
    setTimeLeft(60);
    setResults(null);
    setShowResult(false);
  };

  const handleSaveName = () => {
    if (name.trim()) {
      sessionStorage.setItem('studentName', name.trim());
      setName(name.trim());
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    socket.emit('chatMessage', chatInput);
    setChatInput('');
  };

  if (!sessionStorage.getItem('studentName')) {
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
            onClick={handleSaveName}
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
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Hello, {name} 👋</h2>
      {question ? (
        submitted && showResult ? (
          results ? (
            <div>
              <h3>📊 Live Poll Results</h3>
              <p><strong>Question:</strong> {question.text}</p>
              {question.options.map((opt, idx) => {
                const totalVotes = Object.values(results).length;
                const votesForOpt = Object.values(results).filter(ans => ans === opt).length;
                const percent = totalVotes ? Math.round((votesForOpt / totalVotes) * 100) : 0;

                return (
                  <div key={idx} style={{ margin: '10px 0' }}>
                    <strong>{opt}</strong> — {percent}% ({votesForOpt} votes)
                    <div style={{
                      height: '10px',
                      width: '100%',
                      background: '#eee',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      marginTop: '5px'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        background: '#8F64E1',
                        height: '100%'
                      }} />
                    </div>
                  </div>
                );
              })}
              <button
                onClick={handleCloseResults}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <WaitingScreen message="Thanks! Waiting for the next question..." />
          )
        ) : (
          <PollQuestion
            question={question}
            answer={answer}
            setAnswer={setAnswer}
            submitted={submitted}
            timeLeft={timeLeft}
            handleSubmit={handleSubmit}
          />
        )
      ) : (
        <WaitingScreen message="Waiting for the teacher to start the poll..." />
      )}

      {/* 💬 Chat Button & Window */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: '#8F64E1',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 60,
          height: 60,
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        💬
      </button>

      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 300,
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '50vh',
          overflow: 'hidden'
        }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
            {messages.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No messages yet</p>}
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <strong style={{ color: msg.isTeacher ? '#1D68BD' : '#8F64E1' }}>
                  {msg.sender}:
                </strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: 'none',
                padding: 10,
                fontSize: 14,
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendChat}
              style={{
                background: '#8F64E1',
                color: '#fff',
                border: 'none',
                padding: '0 15px',
                cursor: 'pointer'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;

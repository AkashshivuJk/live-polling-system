import React, { useState, useEffect } from 'react';
import socket from '../socket';
import LiveResults from './LiveResults';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Teacher = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timer, setTimer] = useState(60);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [results, setResults] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    // 🔗 Join as teacher when component mounts
    socket.emit('teacher:join', { teacherId: 'teacher-1' });

    // ✅ Receive full poll state (when first joined OR after update)
    socket.on('poll_state', (state) => {
      setCurrentQuestion(state.currentQuestion || null);
      setResults(state.liveResults || {});
    });

    // ✅ Live results update
    socket.on('live_results', (answers) => {
      setResults(answers);
    });

    // ✅ Question ended, update history
    socket.on('question_ended', (finalResults) => {
      if (currentQuestion) {
        const completedPoll = { ...currentQuestion, results: finalResults };
        setPollHistory((prev) => [...prev, completedPoll]);
      }
      setCurrentQuestion(null);
      setResults({});
    });

    return () => {
      socket.off('poll_state');
      socket.off('live_results');
      socket.off('question_ended');
    };
  }, [currentQuestion]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleBroadcast = () => {
    if (!question.trim() || options.some((opt) => !opt.trim()) || correctOptionIndex === null) {
      toast.error('Please fill all fields and mark the correct answer!');
      return;
    }

    const data = {
      question,
      options,
      correctIndex: correctOptionIndex,
      timeLimit: timer,
    };

    socket.emit('teacher:create_question', data);
    setCurrentQuestion(data);
    setResults({});
    toast.success('✅ Poll sent!');

    setQuestion('');
    setOptions(['', '']);
    setCorrectOptionIndex(null);
  };

  const handleClosePoll = () => {
    if (currentQuestion) {
      socket.emit('teacher:end_question');
      toast.info('⏹ Poll ended.');
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Sora' }}>
      <ToastContainer />
      <h1 style={{ fontSize: '30px', marginBottom: '20px' }}>🧑‍🏫 Create a Poll</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '18px' }}>Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="Enter your question here..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            background: '#F2F2F2',
            border: '1px solid #ccc',
            marginTop: '8px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '18px' }}>Options</label>
        {options.map((opt, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, idx)}
              placeholder={`Option ${idx + 1}`}
              style={{
                padding: '10px',
                borderRadius: '6px',
                background: '#F2F2F2',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="correctAnswer"
                checked={correctOptionIndex === idx}
                onChange={() => setCorrectOptionIndex(idx)}
              />
              Mark as correct
            </label>
          </div>
        ))}
        {options.length < 4 && (
          <button
            onClick={addOption}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#EEE',
              border: '1px dashed #7451B6',
              borderRadius: '10px',
              color: '#7C57C2',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            + Add More Option
          </button>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '18px' }}>Time Duration</label>
        <select
          value={timer}
          onChange={(e) => setTimer(Number(e.target.value))}
          style={{
            marginLeft: '10px',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '16px',
          }}
        >
          <option value={30}>30 seconds</option>
          <option value={45}>45 seconds</option>
          <option value={60}>60 seconds</option>
        </select>
      </div>

      <button
        onClick={handleBroadcast}
        style={{
          padding: '12px 50px',
          background: 'linear-gradient(99deg, #8F64E1 -46.89%, #1D68BD 223.45%)',
          color: '#FFF',
          fontSize: '18px',
          fontWeight: '600',
          borderRadius: '34px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Ask Question
      </button>

      {/* ✅ Live Poll Results */}
      {currentQuestion && Object.keys(results).length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <LiveResults question={currentQuestion} answers={results} />
          <button
            onClick={handleClosePoll}
            style={{
              marginTop: '20px',
              padding: '10px 30px',
              background: '#222',
              color: '#fff',
              borderRadius: '25px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Close Poll
          </button>
        </div>
      )}

      {/* ✅ Poll History */}
      {pollHistory.length > 0 && (
        <div style={{ marginTop: '60px' }}>
          <h2>📜 Past Polls</h2>
          {pollHistory.map((poll, idx) => (
            <div key={idx} style={{ marginBottom: '30px' }}>
              <h4>Q{idx + 1}: {poll.question}</h4>
              <LiveResults question={poll} answers={poll.results} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teacher;

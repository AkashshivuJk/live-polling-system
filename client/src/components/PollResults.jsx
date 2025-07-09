import React from 'react';

const PollResults = ({ question, answers }) => {
  const total = Object.keys(answers).length;

  const counts = question.options.map((opt) =>
    Object.values(answers).filter((a) => a === opt).length
  );

  const percentages = counts.map((c) => (total > 0 ? Math.round((c / total) * 100) : 0));

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>{question.text}</h3>
      {question.options.map((opt, idx) => (
        <div
          key={idx}
          style={{
            margin: '12px 0',
            background: question.correctIndex === idx ? '#E3FBE3' : '#F1F1F1',
            border: question.correctIndex === idx ? '2px solid green' : '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          <strong>
            {idx + 1}. {opt}
            {question.correctIndex === idx ? ' ✅' : ''}
          </strong>
          <div style={{ marginTop: '4px', fontSize: '14px', color: '#333' }}>
            {counts[idx]} vote(s) — {percentages[idx]}%
            <div
              style={{
                height: '8px',
                marginTop: '4px',
                background: '#D0D0FF',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percentages[idx]}%`,
                  height: '100%',
                  background: '#5A66D1',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollResults;

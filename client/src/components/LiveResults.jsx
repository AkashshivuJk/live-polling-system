import React from 'react';

const LiveResults = ({ question, answers }) => {
  const totalVotes = Object.keys(answers).length;
  const voteCounts = question.options.map(
    (opt) => Object.values(answers).filter((ans) => ans === opt).length
  );

  const getPercentage = (count) =>
    totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '22px', fontFamily: 'Sora', fontWeight: 600 }}>
        Live Poll Results
      </h2>

      <p style={{ fontSize: '18px', marginBottom: '20px' }}>{question.text}</p>

      {question.options.map((option, idx) => {
        const count = voteCounts[idx];
        const percentage = getPercentage(count);
        const isCorrect = idx === question.correctIndex;

        return (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500 }}>{option}</span>
              <span>{percentage}% ({count} vote{count !== 1 ? 's' : ''})</span>
            </div>

            <div
              style={{
                height: '18px',
                borderRadius: '6px',
                background: '#e0e0e0',
                marginTop: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: isCorrect
                    ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                    : '#8F64E1',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>

            {isCorrect && (
              <div style={{ color: '#4CAF50', fontSize: '14px', marginTop: '4px' }}>
                ✅ Correct Answer
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LiveResults;

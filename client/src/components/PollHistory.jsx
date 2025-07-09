import React from 'react';

const PollHistory = ({ history }) => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>📋 <strong>View Poll History</strong></h2>
      {history.map((poll, index) => {
        const totalVotes = Object.values(poll.results).length;

        return (
          <div key={index} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '30px',
            background: '#fefefe'
          }}>
            <h3>Question {index + 1}</h3>
            <div style={{
              background: '#444',
              padding: '10px 15px',
              color: '#fff',
              borderRadius: '8px',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              {poll.question}
            </div>

            {poll.options.map((opt, idx) => {
              const voteCount = Object.values(poll.results).filter(ans => ans === opt).length;
              const percent = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;

              return (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#8F64E1',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>{idx + 1}</div>
                    <strong>{opt}</strong>
                    <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{percent}%</span>
                  </div>

                  <div style={{
                    height: '10px',
                    background: '#eee',
                    borderRadius: '6px',
                    marginTop: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: '#8F64E1'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PollHistory;

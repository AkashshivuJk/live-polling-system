import React from 'react';

const PollQuestion = ({ question, answer, setAnswer, submitted, timeLeft, handleSubmit }) => {
  return (
    <div style={{
      width: '727px',
      borderRadius: '9px',
      border: '1px solid #AF8FF1',
      padding: '0',
      margin: 'auto',
      marginTop: '80px',
      background: '#FFF'
    }}>
      <div style={{
        height: '50px',
        paddingLeft: '16px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #343434 0%, #6E6E6E 100%)',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        color: '#FFF',
        fontFamily: 'Sora',
        fontSize: '17px',
        fontWeight: '600'
      }}>
        {question.text}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', fontFamily: 'Sora' }}>Question 1</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#000" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#CB1206', fontFamily: 'Sora' }}>
            {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
          </span>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {question.options.map((opt, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '18px 20px',
            marginBottom: '12px',
            borderRadius: '6px',
            background: answer === opt ? '#E5D6FF' : '#F6F6F6',
            border: answer === opt ? '2px solid #8F64E1' : '1px solid rgba(141, 141, 141, 0.19)',
            cursor: 'pointer'
          }}
            onClick={() => !submitted && setAnswer(opt)}
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '22px',
              background: answer === opt ? 'linear-gradient(244deg, #8F64E1 -50.82%, #4E377B 216.33%)' : '#8D8D8D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontFamily: 'Sora',
              fontWeight: 700
            }}>{idx + 1}</div>
            <div style={{
              color: '#2E2E2E',
              fontFamily: 'Sora',
              fontSize: '16px',
              fontWeight: answer === opt ? '600' : '400'
            }}>{opt}</div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <button onClick={handleSubmit} disabled={!answer} style={{
            padding: '12px 40px',
            borderRadius: '34px',
            background: 'linear-gradient(99deg, #8F64E1 -46.89%, #1D68BD 223.45%)',
            color: '#FFF',
            fontSize: '18px',
            fontWeight: '600',
            border: 'none',
            fontFamily: 'Sora',
            cursor: 'pointer'
          }}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default PollQuestion;

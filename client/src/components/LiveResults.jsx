import React, { useEffect, useState } from "react";

const LivePoll = ({ activePoll, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(activePoll.timeLimit || 60);

  useEffect(() => {
    if (!activePoll) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp(); // call backend or socket event to close poll
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activePoll]);

  return (
    <div>
      <h2 className="text-xl font-bold">{activePoll.question}</h2>
      <p className="text-sm text-gray-600 mb-2">
        Time left: {timeLeft}s
      </p>

      {/* Options UI here */}
    </div>
  );
};

export default LivePoll;

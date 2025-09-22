import React, { useState, useMemo } from "react";

const PollHistory = ({ polls }) => {
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredPolls = useMemo(() => {
    return polls.filter((poll) => {
      const matchesSearch = poll.question
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesFilter =
        filterType === "all"
          ? true
          : filterType === "correct"
          ? poll.options.some((opt) => opt.isCorrect)
          : true; 
      return matchesSearch && matchesFilter;
    });
  }, [polls, searchText, filterType]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">📜 Poll History</h2>

      {/* Search + Filter Controls */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search question..."
          className="border rounded p-2 flex-1"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Polls</option>
          <option value="correct">Only with Correct Answer</option>
        </select>
      </div>

      {/* Filtered Poll List */}
      {filteredPolls.length === 0 ? (
        <p className="text-gray-500">No polls found.</p>
      ) : (
        filteredPolls.map((poll, idx) => (
          <div key={idx} className="mb-4 border-b pb-2">
            <h3 className="font-semibold">{poll.question}</h3>
            {poll.options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center ${
                  opt.isCorrect ? "text-green-600" : ""
                }`}
              >
                <span className="mr-2">{opt.text}</span>
                {opt.isCorrect && <span>✅</span>}
                <span className="ml-auto text-sm text-gray-600">
                  {opt.votes} votes
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PollHistory;

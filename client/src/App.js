import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Student from './components/Student';
import Teacher from './components/Teacher';
import EnterName from './components/EnterName'; // ← import the new component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enter-name" element={<EnterName />} /> {/* 👈 new route */}
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
      </Routes>
    </Router>
  );
};

export default App;

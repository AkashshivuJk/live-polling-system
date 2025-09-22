// server/models/Poll.js
// In-memory Poll manager
// Keeps: students, currentQuestion, answers, history
class Poll {
  constructor(io) {
    this.io = io;
    this.students = {}; // socketId -> { name, joinedAt }
    this.nameToSocket = {}; // name -> socketId
    this.currentQuestion = null;
    this.answers = {}; // name -> answerIndex
    this.history = []; // array of past question results
    this.timerHandle = null;
    this.questionStartAt = null;
  }

  // Student management
  addStudent(socketId, name) {
    // name uniqueness check (per-server). Frontend should use sessionStorage per-tab.
    if (!name || typeof name !== 'string' || !name.trim()) {
      return { ok: false, message: 'Name required' };
    }
    if (this.nameToSocket[name]) {
      // name collision
      return { ok: false, message: 'Name already in use on the server. Use a different name.' };
    }
    this.students[socketId] = { name, joinedAt: Date.now() };
    this.nameToSocket[name] = socketId;
    return { ok: true };
  }

  removeStudentBySocket(socketId) {
    const s = this.students[socketId];
    if (!s) return null;
    delete this.nameToSocket[s.name];
    delete this.students[socketId];
    // also remove answer if pending
    if (this.answers[s.name] !== undefined) delete this.answers[s.name];
    return s;
  }

  removeStudentByName(name) {
    const socketId = this.nameToSocket[name];
    if (!socketId) return { ok: false };
    delete this.nameToSocket[name];
    delete this.students[socketId];
    if (this.answers[name] !== undefined) delete this.answers[name];
    return { ok: true, socketId, name };
  }

  getStudents() {
    return Object.values(this.students).map(s => ({ name: s.name, joinedAt: s.joinedAt }));
  }

  // Question lifecycle
  createQuestion({ question, options = [], timeLimit = 60 }) {
    if (this.currentQuestion) {
      return { ok: false, message: 'There is already an active question' };
    }
    if (!question || !Array.isArray(options) || options.length < 2) {
      return { ok: false, message: 'Invalid question or options' };
    }
    // reset answers
    this.answers = {};
    this.currentQuestion = {
      question,
      options,
      timeLimit: Number(timeLimit) || 60,
      startedAt: Date.now(),
      ended: false,
    };
    this.questionStartAt = Date.now();

    // start timer
    this._startTimer(this.currentQuestion.timeLimit);
    return { ok: true };
  }

  _startTimer(seconds) {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    this.timerHandle = setTimeout(() => {
      this.endCurrentQuestion('timer');
    }, seconds * 1000);
  }

  submitAnswer(name, answerIndex) {
    if (!this.currentQuestion || this.currentQuestion.ended) {
      return { ok: false, message: 'No active question' };
    }
    if (!this.nameToSocket[name]) {
      return { ok: false, message: 'Unknown student' };
    }
    if (this.answers[name] !== undefined) {
      return { ok: false, message: 'Already answered' };
    }
    // store answer
    this.answers[name] = answerIndex;
    // If all students answered, end early
    if (this._allStudentsAnswered()) {
      this.endCurrentQuestion('all_answered');
    }
    return { ok: true };
  }

  _allStudentsAnswered() {
    const studentNames = Object.values(this.students).map(s=>s.name);
    if (studentNames.length === 0) return false;
    return studentNames.every(n => this.answers[n] !== undefined);
  }

  getLiveResults() {
    // returns counts by option index (partial)
    const counts = {};
    if (!this.currentQuestion) return { counts, total: 0 };
    for (let i = 0; i < this.currentQuestion.options.length; i++) counts[i] = 0;
    let answered = 0;
    for (const [name, idx] of Object.entries(this.answers)) {
      if (counts[idx] !== undefined) counts[idx] += 1;
      answered++;
    }
    return { counts, answered, totalStudents: Object.keys(this.nameToSocket).length };
  }

  endCurrentQuestion(reason = 'unknown') {
    if (!this.currentQuestion || this.currentQuestion.ended) return false;
    this.currentQuestion.ended = true;
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
    // prepare final results
    const final = this.getLiveResults();
    const record = {
      question: this.currentQuestion.question,
      options: this.currentQuestion.options,
      timeLimit: this.currentQuestion.timeLimit,
      startedAt: this.currentQuestion.startedAt,
      endedAt: Date.now(),
      reason,
      results: final,
      answers: { ...this.answers },
    };
    this.history.push(record);
    // keep currentQuestion for reference (but flagged ended)
    // send results to all
    try {
      // emit final results to students & teachers
      this.io.to('students').emit('question_ended', this._publicizeRecord(record));
      this.io.to('teachers').emit('question_ended', this._publicizeRecord(record));
      // also emit poll history updates to teachers
      this.io.to('teachers').emit('poll_history', this.getHistory());
    } catch (err) {
      console.error('emit error', err);
    }
    return true;
  }

  endCurrentQuestionIfAllAnswered() {
    if (this._allStudentsAnswered()) {
      this.endCurrentQuestion('all_answered');
    }
  }

  getPublicQuestion() {
    if (!this.currentQuestion || this.currentQuestion.ended) return null;
    return {
      question: this.currentQuestion.question,
      options: this.currentQuestion.options,
      timeLimit: this.currentQuestion.timeLimit,
      startedAt: this.currentQuestion.startedAt,
    };
  }

  getPublicResults() {
    const last = this.history[this.history.length - 1];
    if (!last) return null;
    return this._publicizeRecord(last);
  }

  _publicizeRecord(record) {
    return {
      question: record.question,
      options: record.options,
      results: record.results,
      startedAt: record.startedAt,
      endedAt: record.endedAt,
      reason: record.reason,
      total: Object.values(record.results.counts || {}).reduce((a,b)=>a+b,0),
    };
  }

  getStateForTeacher() {
    return {
      currentQuestion: this.currentQuestion ? this.getPublicQuestion() : null,
      liveResults: this.getLiveResults(),
      students: this.getStudents(),
      history: this.getHistory(),
    };
  }

  getStateForStudent(name) {
    return {
      currentQuestion: this.getPublicQuestion(),
      answered: this.answers[name] !== undefined,
      timeLeft: this._getTimeLeft(),
    };
  }

  _getTimeLeft() {
    if (!this.currentQuestion || this.currentQuestion.ended) return 0;
    const elapsed = (Date.now() - this.questionStartAt) / 1000;
    return Math.max(0, Math.round(this.currentQuestion.timeLimit - elapsed));
  }

  getHistory() {
    // return summarized history
    return this.history.map(r=>this._publicizeRecord(r));
  }
}

module.exports = Poll;

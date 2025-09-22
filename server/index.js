// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const pollRoutes = require('./routes/pollRoutes');
const Poll = require('./models/Poll');
app.set('pollInstance', poll);


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/polls', pollRoutes);

// simple health
app.get('/', (req, res) => res.send({ ok: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Single Poll manager (memory)
const poll = new Poll(io);

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  // Teacher joins a special room
  socket.on('teacher:join', ({ teacherId }) => {
    socket.join('teachers');
    console.log('Teacher joined:', teacherId || socket.id);
    // send current state to teacher
    socket.emit('poll_state', poll.getStateForTeacher());
  });

  // Student joins — provide name (unique per tab)
  socket.on('student:join', ({ name }) => {
    // try to register student
    const added = poll.addStudent(socket.id, name);
    if (!added.ok) {
      socket.emit('student:join_error', { message: added.message });
      return;
    }
    socket.join('students');
    // send current question state to this student
    socket.emit('poll_state', poll.getStateForStudent(name));
    // broadcast updated student list to teachers
    io.to('teachers').emit('students_list', poll.getStudents());
    console.log(`Student joined: ${name} (${socket.id})`);
  });

  // Teacher creates a question (poll)
  socket.on('teacher:create_question', ({ question, options = [], timeLimit = 60 }) => {
    const created = poll.createQuestion({ question, options, timeLimit });
    if (!created.ok) {
      socket.emit('teacher:create_error', { message: created.message });
      return;
    }
    // broadcast new question to students
    io.to('students').emit('question_started', poll.getPublicQuestion());
    // broadcast new state to teachers
    io.to('teachers').emit('poll_state', poll.getStateForTeacher());
  });

  // Student submits answer
  socket.on('student:submit_answer', ({ name, answerIndex }) => {
    const submitted = poll.submitAnswer(name, answerIndex);
    if (!submitted.ok) {
      socket.emit('student:submit_error', { message: submitted.message });
      return;
    }
    // ack to student
    socket.emit('student:submit_ack', { ok: true });
    // update teachers with live results (partial)
    io.to('teachers').emit('live_results', poll.getLiveResults());
    // if all answered, server will auto-close and broadcast final results via poll internals
  });

  // Teacher can force end the question early
  socket.on('teacher:end_question', () => {
    const ended = poll.endCurrentQuestion('teacher');
    if (ended) {
      io.to('students').emit('question_ended', poll.getPublicResults());
      io.to('teachers').emit('poll_state', poll.getStateForTeacher());
    }
  });

  // Teacher can remove a student by name
  socket.on('teacher:remove_student', ({ name }) => {
    const removed = poll.removeStudentByName(name);
    io.to('teachers').emit('students_list', poll.getStudents());
    io.to('students').emit('student_removed', { name });
    // attempt to disconnect any socket with that name
    if (removed.socketId) {
      io.sockets.sockets.get(removed.socketId)?.disconnect(true);
    }
  });

  // Client requests poll history (teacher)
  socket.on('teacher:get_history', () => {
    socket.emit('poll_history', poll.getHistory());
  });

  // Disconnect
  socket.on('disconnect', () => {
    const removed = poll.removeStudentBySocket(socket.id);
    if (removed) {
      io.to('teachers').emit('students_list', poll.getStudents());
      console.log('Student disconnected and removed:', removed.name);
    } else {
      console.log('Socket disconnected:', socket.id);
    }
  });
});

// dynamic port
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

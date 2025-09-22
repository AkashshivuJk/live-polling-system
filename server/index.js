const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const pollRoutes = require('./routes/pollRoutes');
const Poll = require('./models/Poll');

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
app.set('pollInstance', poll);

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  // --- 🔗 TEACHER JOIN ---
  socket.on('teacher:join', ({ teacherId }) => {
    socket.join('teachers');
    console.log('Teacher joined:', teacherId || socket.id);
    socket.emit('poll_state', poll.getStateForTeacher());
  });

  // --- 🔗 STUDENT JOIN ---
  socket.on('student:join', ({ name }) => {
    const added = poll.addStudent(socket.id, name);
    if (!added.ok) {
      socket.emit('student:join_error', { message: added.message });
      return;
    }
    socket.join('students');
    socket.emit('poll_state', poll.getStateForStudent(name));
    io.to('teachers').emit('students_list', poll.getStudents());
    console.log(`Student joined: ${name} (${socket.id})`);
  });

  // --- 📝 TEACHER CREATES QUESTION ---
  socket.on('teacher:create_question', ({ question, options = [], timeLimit = 60 }) => {
    const created = poll.createQuestion({ question, options, timeLimit });
    if (!created.ok) {
      socket.emit('teacher:create_error', { message: created.message });
      return;
    }
    io.to('students').emit('question_started', poll.getPublicQuestion());
    io.to('teachers').emit('poll_state', poll.getStateForTeacher());
  });

  // --- 📨 STUDENT SUBMITS ANSWER ---
  socket.on('student:submit_answer', ({ name, answerIndex }) => {
    const submitted = poll.submitAnswer(name, answerIndex);
    if (!submitted.ok) {
      socket.emit('student:submit_error', { message: submitted.message });
      return;
    }
    socket.emit('student:submit_ack', { ok: true });
    io.to('teachers').emit('live_results', poll.getLiveResults());
  });

  // --- 🛑 TEACHER ENDS QUESTION EARLY ---
  socket.on('teacher:end_question', () => {
    const ended = poll.endCurrentQuestion('teacher');
    if (ended) {
      io.to('students').emit('question_ended', poll.getPublicResults());
      io.to('teachers').emit('poll_state', poll.getStateForTeacher());
    }
  });

  // --- 🧹 TEACHER REMOVES STUDENT ---
  socket.on('teacher:remove_student', ({ name }) => {
    const removed = poll.removeStudentByName(name);
    io.to('teachers').emit('students_list', poll.getStudents());
    io.to('students').emit('student_removed', { name });
    if (removed.socketId) {
      io.sockets.sockets.get(removed.socketId)?.disconnect(true);
    }
  });

  // --- 📜 POLL HISTORY REQUEST ---
  socket.on('teacher:get_history', () => {
    socket.emit('poll_history', poll.getHistory());
  });

  // --- 💬 CHAT FEATURE ---
  socket.on('registerName', (name, isTeacher) => {
    socket.data.name = name;
    socket.data.isTeacher = isTeacher;
  });

  socket.on('chatMessage', (message) => {
    const payload = {
      sender: socket.data.name || 'Anonymous',
      isTeacher: socket.data.isTeacher,
      message,
      timestamp: new Date().toISOString(),
    };

    if (socket.data.isTeacher) {
      // Teacher → broadcast to all students
      socket.broadcast.emit('chatMessage', payload);
    } else {
      // Student → send only to teacher(s)
      io.sockets.sockets.forEach((s) => {
        if (s.data?.isTeacher) s.emit('chatMessage', payload);
      });
    }

    // Echo back to sender
    socket.emit('chatMessage', payload);
  });

  // --- 🔌 DISCONNECT ---
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

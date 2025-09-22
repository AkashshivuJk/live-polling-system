const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let currentQuestion = null;
let answers = {};
let socketToStudent = {};

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  socket.on('student_joined', (name) => {
    socketToStudent[socket.id] = name;
    console.log(`👨‍🎓 Student joined: ${name}`);

    // If question is active, send it to the new student
    if (currentQuestion) {
      socket.emit('new_question', currentQuestion);
    }
  });

  socket.on('send_question', (data) => {
    currentQuestion = data;
    answers = {};
    io.emit('new_question', data);
    console.log('📡 Sent question:', data);
  });

  socket.on('submit_answer', ({ name, answer }) => {
    answers[name] = answer;
    io.emit('update_results', answers);
  });

  socket.on('question_complete', () => {
    currentQuestion = null;
    answers = {};
    io.emit('question_complete');
  });

  socket.on('disconnect', () => {
    const name = socketToStudent[socket.id];
    console.log(`🔴 ${name || 'Unknown'} disconnected`);
    delete socketToStudent[socket.id];
  });
});

// ✅ Use dynamic port for deployment (e.g., Render sets PORT for you)
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

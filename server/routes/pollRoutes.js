const express = require('express');
const router = express.Router();


router.get('/history', (req, res) => {
  const poll = req.app.get('pollInstance');
  if (!poll) return res.status(500).json({ message: 'Poll backend not initialized' });
  return res.json(poll.getHistory());
});

router.get('/state', (req, res) => {
  const poll = req.app.get('pollInstance');
  if (!poll) return res.status(500).json({ message: 'Poll backend not initialized' });
  return res.json(poll.getStateForTeacher());
});

module.exports = router;



const express = require('express');
const router = express.Router();
const PollSingleton = require('../models/Poll'); 

let pollInstance = null;
function setPollInstance(instance) {
  pollInstance = instance;
}


router.get('/history', (req, res) => {
  if (!pollInstance) return res.status(500).json({ message: 'Poll instance not available' });
  return res.json(pollInstance.getHistory());
});


router.get('/state', (req, res) => {
  if (!pollInstance) return res.status(500).json({ message: 'Poll instance not available' });
  return res.json(pollInstance.getStateForTeacher());
});

module.exports = { router, setPollInstance };
